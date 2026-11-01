"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ChannelStatus = "pending" | "running" | "done" | "error" | "skipped";
type ChannelState = { status: ChannelStatus; message?: string; url?: string };
type Channel = "prismic" | "instagram" | "tiktok";
type PublicJob = { id: string } & Record<Channel, ChannelState>;
type StepResponse = { job: PublicJob; done: boolean; wait?: number; error?: string };

type Props = {
  status: {
    prismic: boolean;
    instagram: boolean;
    tiktok: boolean;
    tiktokConnected: boolean;
    tiktokMode: "direct" | "inbox";
  };
};

const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
const MAX_CHANNEL_TIME_MS = 20 * 60 * 1000;
const HEADERS = { "x-panel-request": "1" };

const CHANNEL_LABELS: Record<Channel, string> = {
  prismic: "Strona (Prismic, Aktualności)",
  instagram: "Instagram (Reels)",
  tiktok: "TikTok"
};

const STATUS_LABELS: Record<ChannelStatus, string> = {
  pending: "Czeka",
  running: "W toku",
  done: "Gotowe",
  error: "Błąd",
  skipped: "Pominięte"
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function request<T>(url: string, init: RequestInit) {
  const response = await fetch(url, { ...init, headers: { ...HEADERS, ...init.headers } });
  const body = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) {
    throw new Error(body.error || `Błąd serwera (${response.status}).`);
  }
  return body;
}

export function ReelUploader({ status }: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "uploading" | "processing" | "finished">("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [job, setJob] = useState<PublicJob | null>(null);
  const jobRef = useRef<PublicJob | null>(null);
  const busy = phase === "uploading" || phase === "processing";

  useEffect(() => {
    if (!busy) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [busy]);

  function updateJob(next: PublicJob) {
    jobRef.current = next;
    setJob(next);
  }

  async function runStep(id: string, channel: Channel) {
    const started = Date.now();
    while (Date.now() - started < MAX_CHANNEL_TIME_MS) {
      let result: StepResponse;
      try {
        result = await request<StepResponse>(`/api/panel/reels/${id}/${channel}`, { method: "POST" });
      } catch (stepError) {
        const current = jobRef.current;
        if (current) {
          updateJob({
            ...current,
            [channel]: { status: "error", message: (stepError as Error).message }
          });
        }
        return;
      }
      updateJob(result.job);
      if (result.done) return;
      await sleep(result.wait ?? 5000);
    }
    const current = jobRef.current;
    if (current) {
      updateJob({
        ...current,
        [channel]: {
          ...current[channel],
          status: "error",
          message: "Przekroczono czas oczekiwania. Kliknij „Ponów”, żeby sprawdzić status."
        }
      });
    }
  }

  async function runSocial(id: string) {
    setPhase("processing");
    await runStep(id, "prismic");
    if (jobRef.current?.prismic.status === "done") {
      await Promise.all([runStep(id, "instagram"), runStep(id, "tiktok")]);
    }
    const final = jobRef.current;
    const allSettled =
      final &&
      (["prismic", "instagram", "tiktok"] as const).every((channel) =>
        ["done", "skipped"].includes(final[channel].status)
      );
    if (allSettled) {
      await request(`/api/panel/reels/${id}/cleanup`, { method: "POST" }).catch(() => undefined);
    }
    setPhase("finished");
  }

  async function retry(channel: Channel) {
    if (!job) return;
    setPhase("processing");
    if (channel === "prismic") {
      await runSocial(job.id);
      return;
    }
    await runStep(job.id, channel);
    setPhase("finished");
  }

  async function finish() {
    if (job) {
      await request(`/api/panel/reels/${job.id}/cleanup`, { method: "POST" }).catch(() => undefined);
    }
    setJob(null);
    jobRef.current = null;
    setPhase("idle");
    setProgress(0);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const video = form.get("video");

    if (!(video instanceof File) || video.size === 0) {
      setError("Wybierz plik wideo.");
      return;
    }
    if (!["video/mp4", "video/quicktime"].includes(video.type)) {
      setError("Dozwolone są pliki MP4 lub MOV.");
      return;
    }
    if (video.size > MAX_VIDEO_SIZE) {
      setError("Plik jest większy niż 100 MB. Wyeksportuj go w niższej jakości.");
      return;
    }

    form.delete("video");
    form.set("filename", video.name);
    form.set("contentType", video.type);
    form.set("size", String(video.size));

    setPhase("uploading");
    setProgress(0);

    try {
      const created = await request<{ job: PublicJob; chunkSize: number; chunkCount: number }>(
        "/api/panel/reels",
        { method: "POST", body: form }
      );
      updateJob(created.job);

      let next = 0;
      let uploaded = 0;
      const uploadWorker = async () => {
        while (next < created.chunkCount) {
          const index = next++;
          const blob = video.slice(index * created.chunkSize, (index + 1) * created.chunkSize);
          for (let attempt = 1; ; attempt += 1) {
            try {
              await request(`/api/panel/reels/${created.job.id}/chunks/${index}`, {
                method: "PUT",
                headers: { "Content-Type": "application/octet-stream" },
                body: blob
              });
              break;
            } catch (chunkError) {
              if (attempt >= 3) throw chunkError;
              await sleep(1000 * attempt);
            }
          }
          uploaded += 1;
          setProgress(Math.round((uploaded / created.chunkCount) * 100));
        }
      };
      await Promise.all([uploadWorker(), uploadWorker(), uploadWorker()]);

      await runSocial(created.job.id);
    } catch (submitError) {
      setError((submitError as Error).message);
      setPhase(jobRef.current ? "finished" : "idle");
    }
  }

  async function logout() {
    await request("/api/panel/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/panel/logowanie");
    router.refresh();
  }

  return (
    <div className="panel-stack">
      {!status.prismic ? (
        <p className="form-status error">
          Brak PRISMIC_WRITE_TOKEN. Bez niego nie da się zapisać rolki.
        </p>
      ) : null}

      {phase === "idle" ? (
        <form className="contact-form form-panel" onSubmit={handleSubmit}>
          <label>
            <span>Plik wideo (MP4/MOV, do 100 MB)</span>
            <input name="video" type="file" accept="video/mp4,video/quicktime" required />
          </label>
          <label>
            <span>Tytuł wpisu na stronie</span>
            <input name="title" maxLength={100} required />
          </label>
          <label>
            <span>Opis (strona, podpis na Instagramie i TikToku)</span>
            <textarea name="description" rows={6} maxLength={2200} required />
          </label>
          <label>
            <span>Kategoria w Aktualnościach</span>
            <select name="category" defaultValue="Aktualnosci">
              <option value="Aktualnosci">Aktualności</option>
              <option value="Vlog">Vlog</option>
              <option value="Poradniki">Poradniki</option>
            </select>
          </label>
          <label>
            <span>Okładka (opcjonalnie, JPG/PNG/WebP do 3 MB)</span>
            <input name="cover" type="file" accept="image/jpeg,image/png,image/webp" />
          </label>

          <fieldset className="panel-targets">
            <legend>Gdzie opublikować</legend>
            <label className="panel-check">
              <input name="publish" type="checkbox" defaultChecked />
              <span>Od razu opublikuj wpis na stronie</span>
            </label>
            <label className="panel-check">
              <input name="instagram" type="checkbox" defaultChecked={status.instagram} disabled={!status.instagram} />
              <span>Instagram (Reels){status.instagram ? "" : ": nieskonfigurowany"}</span>
            </label>
            <label className="panel-check">
              <input
                name="tiktok"
                type="checkbox"
                defaultChecked={status.tiktokConnected}
                disabled={!status.tiktokConnected}
              />
              <span>
                TikTok
                {status.tiktokConnected
                  ? status.tiktokMode === "inbox"
                    ? " (trafi do szkiców w aplikacji)"
                    : ""
                  : status.tiktok
                    ? ": niepołączony"
                    : ": nieskonfigurowany"}
              </span>
            </label>
            {status.tiktok && !status.tiktokConnected ? (
              <a className="button button-secondary" href="/api/panel/tiktok/connect">
                Połącz TikTok
              </a>
            ) : null}
          </fieldset>

          <button className="button button-primary" type="submit" disabled={!status.prismic}>
            Dodaj rolkę
          </button>
          {error ? (
            <p className="form-status error" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      ) : (
        <div className="form-panel panel-progress" aria-live="polite">
          {phase === "uploading" ? (
            <>
              <p>Wysyłanie pliku: {progress}%</p>
              <progress max={100} value={progress} />
            </>
          ) : null}

          {job ? (
            <ul className="panel-channels">
              {(["prismic", "instagram", "tiktok"] as const).map((channel) => {
                const state = job[channel];
                return (
                  <li key={channel} data-status={state.status}>
                    <strong>{CHANNEL_LABELS[channel]}</strong>
                    <span className="panel-badge">{STATUS_LABELS[state.status]}</span>
                    {state.message ? <p>{state.message}</p> : null}
                    {state.url ? (
                      <a href={state.url} target="_blank" rel="noreferrer">
                        Zobacz
                      </a>
                    ) : null}
                    {state.status === "error" && phase === "finished" ? (
                      <button className="button button-secondary" type="button" onClick={() => retry(channel)}>
                        Ponów
                      </button>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : null}

          {error ? (
            <p className="form-status error" role="alert">
              {error}
            </p>
          ) : null}

          {phase === "finished" ? (
            <button className="button button-primary" type="button" onClick={finish}>
              Dodaj kolejną rolkę
            </button>
          ) : (
            <p>Nie zamykaj tej karty, dopóki wszystko się nie zakończy.</p>
          )}
        </div>
      )}

      <button className="button button-ghost" type="button" onClick={logout} disabled={busy}>
        Wyloguj
      </button>
    </div>
  );
}
