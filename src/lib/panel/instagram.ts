import type { ReelJob } from "./jobs";

/*
 * Instagram Reels via the Instagram Graph API (content publishing):
 * 1. POST /{ig-user-id}/media (media_type=REELS, video_url) creates a container,
 * 2. GET /{container-id}?fields=status_code until FINISHED,
 * 3. POST /{ig-user-id}/media_publish publishes it.
 * Each call of `stepInstagram` does one of these steps, so no request runs long.
 */

export function isInstagramConfigured() {
  return Boolean(process.env.INSTAGRAM_USER_ID && process.env.INSTAGRAM_ACCESS_TOKEN);
}

function graphUrl(path: string) {
  const host = process.env.INSTAGRAM_GRAPH_HOST || "graph.facebook.com";
  const version = process.env.INSTAGRAM_GRAPH_VERSION || "v23.0";
  return new URL(`https://${host}/${version}/${path}`);
}

async function graph<T>(path: string, init: { method?: "GET" | "POST"; params?: Record<string, string> } = {}) {
  const url = graphUrl(path);
  const params = new URLSearchParams({
    ...init.params,
    access_token: process.env.INSTAGRAM_ACCESS_TOKEN || ""
  });
  const response =
    init.method === "POST"
      ? await fetch(url, { method: "POST", body: params, cache: "no-store" })
      : await fetch(`${url}?${params}`, { cache: "no-store" });
  const body = (await response.json().catch(() => ({}))) as T & {
    error?: { message?: string; error_user_msg?: string };
  };
  if (!response.ok || body.error) {
    const message = body.error?.error_user_msg || body.error?.message || response.statusText;
    throw new Error(`Instagram: ${message}`);
  }
  return body;
}

export type StepResult = { done: boolean; patch: Partial<ReelJob["instagram"]> };

export async function stepInstagram(job: ReelJob): Promise<StepResult> {
  const userId = process.env.INSTAGRAM_USER_ID;
  if (!userId || !process.env.INSTAGRAM_ACCESS_TOKEN) {
    throw new Error("Brak INSTAGRAM_USER_ID lub INSTAGRAM_ACCESS_TOKEN.");
  }
  const state = job.instagram;

  if (state.mediaId) {
    return { done: true, patch: {} };
  }

  if (!state.containerId) {
    if (!job.prismic.videoUrl) {
      throw new Error("Najpierw musi się udać wgranie do Prismic (Instagram pobiera stamtąd plik).");
    }
    const params: Record<string, string> = {
      media_type: "REELS",
      video_url: job.prismic.videoUrl,
      caption: job.description,
      share_to_feed: "true"
    };
    if (job.prismic.coverUrl) {
      params.cover_url = job.prismic.coverUrl;
    }
    const container = await graph<{ id: string }>(`${userId}/media`, { method: "POST", params });
    return {
      done: false,
      patch: { containerId: container.id, message: "Instagram przetwarza wideo..." }
    };
  }

  const container = await graph<{ status_code?: string; status?: string }>(state.containerId, {
    params: { fields: "status_code,status" }
  });

  switch (container.status_code) {
    case "FINISHED":
      break;
    case "ERROR":
    case "EXPIRED":
      // A failed container cannot be reused: drop it so "Ponów" starts over.
      return {
        done: false,
        patch: {
          containerId: undefined,
          status: "error",
          message: `Instagram odrzucił wideo: ${container.status || container.status_code}`
        }
      };
    default:
      return { done: false, patch: { message: "Instagram przetwarza wideo..." } };
  }

  const published = await graph<{ id: string }>(`${userId}/media_publish`, {
    method: "POST",
    params: { creation_id: state.containerId }
  });
  const media = await graph<{ permalink?: string }>(published.id, {
    params: { fields: "permalink" }
  }).catch(() => ({ permalink: undefined }));

  return {
    done: true,
    patch: { mediaId: published.id, url: media.permalink, message: "Opublikowano na Instagramie." }
  };
}
