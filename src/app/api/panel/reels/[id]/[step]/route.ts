import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { guardPanelRequest, jsonError } from "@/lib/panel/auth";
import { stepInstagram } from "@/lib/panel/instagram";
import {
  deleteJobFiles,
  errorMessage,
  loadJob,
  missingChunks,
  saveChannel,
  toPublicJob,
  type ReelJob
} from "@/lib/panel/jobs";
import { publishToPrismic } from "@/lib/panel/prismic-reel";
import { stepTikTok } from "@/lib/panel/tiktok";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Params = { params: Promise<{ id: string; step: string }> };

/** `wait` tells the browser how long to pause before the next call (ms). */
function reply(job: ReelJob, done: boolean, wait = 5000) {
  return NextResponse.json(
    { job: toPublicJob(job), done, wait },
    { headers: { "Cache-Control": "no-store" } }
  );
}

/**
 * Runs one short step of the publishing pipeline. The browser calls it repeatedly until
 * `done` is true, so no single request has to wait for Instagram or TikTok to process video.
 */
export async function POST(request: NextRequest, { params }: Params) {
  const denied = guardPanelRequest(request);
  if (denied) return denied;

  const { id, step } = await params;
  const job = await loadJob(id);
  if (!job) {
    return jsonError("Nie znaleziono rolki.", 404);
  }

  if (step === "prismic") {
    if (job.prismic.status === "done") {
      return reply(job, true);
    }
    const missing = await missingChunks(job);
    if (missing.length > 0) {
      return jsonError(`Brakuje ${missing.length} fragmentów pliku. Wgraj rolkę ponownie.`, 409);
    }
    try {
      const result = await publishToPrismic(job);
      await saveChannel(job, "prismic", {
        status: "done",
        ...result,
        url: job.publishPrismic ? `/aktualnosci/${result.uid}` : undefined,
        message: job.publishPrismic
          ? "Wpis opublikowany w Aktualnościach."
          : "Wpis zapisany w Prismic (wydanie „Migration release”), czeka na publikację."
      });
      if (job.publishPrismic) {
        revalidateTag("prismic", "max");
        revalidatePath("/", "layout");
      }
    } catch (error) {
      await saveChannel(job, "prismic", { status: "error", message: errorMessage(error) });
    }
    return reply(job, true);
  }

  if (step === "instagram" || step === "tiktok") {
    const state = job[step];
    if (state.status === "done" || state.status === "skipped") {
      return reply(job, true);
    }
    try {
      const result = step === "instagram" ? await stepInstagram(job) : await stepTikTok(job);
      const next = { ...state, status: "running" as const, ...result.patch };
      if (result.done) next.status = "done";
      await saveChannel(job, step, next);
      // TikTok chunk uploads continue right away; processing checks are polled every 5 s.
      const uploading = step === "tiktok" && "nextChunk" in result.patch;
      return reply(job, result.done || next.status === "error", uploading ? 0 : 5000);
    } catch (error) {
      await saveChannel(job, step, { ...state, status: "error", message: errorMessage(error) });
      return reply(job, true);
    }
  }

  if (step === "cleanup") {
    await deleteJobFiles(job);
    return reply(job, true);
  }

  return jsonError("Nieznany krok.", 404);
}
