import { randomUUID } from "crypto";
import { panelStore } from "./storage";

/** Upload chunk size. Netlify Functions accept ~6 MB bodies (base64-encoded), so stay well below. */
export const UPLOAD_CHUNK_SIZE = 3 * 1024 * 1024;
/** Prismic Media Library file limit. */
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
export const MAX_COVER_SIZE = 3 * 1024 * 1024;
export const VIDEO_TYPES = ["video/mp4", "video/quicktime"] as const;
export const COVER_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const POST_CATEGORIES = ["Aktualnosci", "Vlog", "Poradniki"] as const;
export const MAX_TITLE_LENGTH = 100;
/** Instagram caption and TikTok title both allow 2200 characters. */
export const MAX_DESCRIPTION_LENGTH = 2200;

export type ChannelStatus = "pending" | "running" | "done" | "error" | "skipped";

export type ChannelState = {
  status: ChannelStatus;
  message?: string;
  url?: string;
};

export type ReelJob = {
  id: string;
  createdAt: string;
  title: string;
  description: string;
  category: (typeof POST_CATEGORIES)[number];
  publishPrismic: boolean;
  filename: string;
  contentType: (typeof VIDEO_TYPES)[number];
  size: number;
  chunkCount: number;
  cover?: { filename: string; contentType: string };
  prismic: ChannelState & { documentId?: string; uid?: string; videoUrl?: string; coverUrl?: string };
  instagram: ChannelState & { containerId?: string; mediaId?: string };
  tiktok: ChannelState & {
    publishId?: string;
    uploadUrl?: string;
    chunkSize?: number;
    totalChunks?: number;
    nextChunk?: number;
    /** Shown again in the final message, e.g. that TikTok only allowed a private post. */
    note?: string;
  };
};

export type PublicReelJob = Pick<ReelJob, "id" | "prismic" | "instagram" | "tiktok">;

export function toPublicJob(job: ReelJob): PublicReelJob {
  const strip = <T extends ChannelState>({ status, message, url }: T) => ({ status, message, url });
  return {
    id: job.id,
    prismic: strip(job.prismic),
    instagram: strip(job.instagram),
    tiktok: strip(job.tiktok)
  };
}

export function newJobId() {
  return randomUUID();
}

export const jobKey = (id: string) => `reels/${id}/job`;
export const chunkKey = (id: string, index: number) => `reels/${id}/chunks/${index}`;
export const coverKey = (id: string) => `reels/${id}/cover`;

export function isJobId(value: string) {
  return /^[0-9a-f-]{36}$/.test(value);
}

export const CHANNELS = ["prismic", "instagram", "tiktok"] as const;
export type Channel = (typeof CHANNELS)[number];

const channelKey = (id: string, channel: Channel) => `reels/${id}/state/${channel}`;

/**
 * Channel states live under their own keys, so the Instagram and TikTok steps, which the
 * browser drives in parallel, never overwrite each other's progress.
 */
export async function loadJob(id: string) {
  if (!isJobId(id)) {
    return null;
  }
  const store = panelStore();
  const job = await store.getJSON<ReelJob>(jobKey(id));
  if (!job) {
    return null;
  }
  const states = await Promise.all(CHANNELS.map((channel) => store.getJSON(channelKey(id, channel))));
  CHANNELS.forEach((channel, index) => {
    if (states[index]) {
      Object.assign(job, { [channel]: states[index] });
    }
  });
  return job;
}

export async function saveJob(job: ReelJob) {
  await panelStore().setJSON(jobKey(job.id), job);
}

export async function saveChannel<C extends Channel>(job: ReelJob, channel: C, state: ReelJob[C]) {
  job[channel] = state;
  await panelStore().setJSON(channelKey(job.id, channel), state);
}

export function expectedChunkSize(job: Pick<ReelJob, "size" | "chunkCount">, index: number) {
  return index === job.chunkCount - 1
    ? job.size - UPLOAD_CHUNK_SIZE * (job.chunkCount - 1)
    : UPLOAD_CHUNK_SIZE;
}

export async function missingChunks(job: ReelJob) {
  const keys = new Set(await panelStore().list(`reels/${job.id}/chunks/`));
  return Array.from({ length: job.chunkCount }, (_, index) => index).filter(
    (index) => !keys.has(chunkKey(job.id, index))
  );
}

/** Reads bytes [start, end) of the uploaded video from its stored chunks. */
export async function readVideoRange(job: ReelJob, start: number, end: number): Promise<Uint8Array<ArrayBuffer>> {
  const store = panelStore();
  const first = Math.floor(start / UPLOAD_CHUNK_SIZE);
  const last = Math.floor((end - 1) / UPLOAD_CHUNK_SIZE);
  const output = new Uint8Array(end - start);
  let written = 0;

  for (let index = first; index <= last; index += 1) {
    const chunk = await store.getBytes(chunkKey(job.id, index));
    if (!chunk) {
      throw new Error(`Brak fragmentu pliku nr ${index}. Wgraj rolkę ponownie.`);
    }
    const chunkStart = index * UPLOAD_CHUNK_SIZE;
    const from = Math.max(start - chunkStart, 0);
    const to = Math.min(end - chunkStart, chunk.length);
    output.set(chunk.subarray(from, to), written);
    written += to - from;
  }

  return output;
}

export async function deleteJobFiles(job: ReelJob) {
  const store = panelStore();
  const keys = await store.list(`reels/${job.id}/chunks/`);
  await Promise.all([...keys, coverKey(job.id)].map((key) => store.delete(key)));
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
