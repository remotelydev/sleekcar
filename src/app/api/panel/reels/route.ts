import { NextResponse, type NextRequest } from "next/server";
import { guardPanelRequest, jsonError } from "@/lib/panel/auth";
import {
  COVER_TYPES,
  MAX_COVER_SIZE,
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
  MAX_VIDEO_SIZE,
  POST_CATEGORIES,
  UPLOAD_CHUNK_SIZE,
  VIDEO_TYPES,
  coverKey,
  newJobId,
  saveJob,
  toPublicJob,
  type ReelJob
} from "@/lib/panel/jobs";
import { isInstagramConfigured } from "@/lib/panel/instagram";
import { isPrismicConfigured } from "@/lib/panel/prismic-reel";
import { panelStore } from "@/lib/panel/storage";
import { isTikTokConfigured } from "@/lib/panel/tiktok";

export const dynamic = "force-dynamic";

function safeFilename(name: string, fallbackExt: string) {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(-80);
  return cleaned.includes(".") ? cleaned : `${cleaned || "rolka"}.${fallbackExt}`;
}

/** Creates an upload job. The video itself follows in chunks (see chunks/[index]). */
export async function POST(request: NextRequest) {
  const denied = guardPanelRequest(request);
  if (denied) return denied;

  if (!isPrismicConfigured()) {
    return jsonError("Brak PRISMIC_WRITE_TOKEN, nie można zapisać rolki.", 503);
  }

  const form = await request.formData().catch(() => null);
  if (!form) {
    return jsonError("Nieprawidłowe dane formularza.", 400);
  }

  const title = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const category = String(form.get("category") ?? "");
  const filename = String(form.get("filename") ?? "");
  const contentType = String(form.get("contentType") ?? "");
  const size = Number(form.get("size"));
  const cover = form.get("cover");

  if (!title || title.length > MAX_TITLE_LENGTH) {
    return jsonError(`Tytuł jest wymagany (maks. ${MAX_TITLE_LENGTH} znaków).`, 400);
  }
  if (!description || description.length > MAX_DESCRIPTION_LENGTH) {
    return jsonError(`Opis jest wymagany (maks. ${MAX_DESCRIPTION_LENGTH} znaków).`, 400);
  }
  if (!POST_CATEGORIES.includes(category as ReelJob["category"])) {
    return jsonError("Nieprawidłowa kategoria.", 400);
  }
  if (!VIDEO_TYPES.includes(contentType as ReelJob["contentType"])) {
    return jsonError("Dozwolone są pliki MP4 lub MOV.", 400);
  }
  if (!Number.isInteger(size) || size <= 0 || size > MAX_VIDEO_SIZE) {
    return jsonError("Plik wideo może mieć maksymalnie 100 MB.", 400);
  }

  const id = newJobId();
  const instagram = form.get("instagram") === "on";
  const tiktok = form.get("tiktok") === "on";
  const job: ReelJob = {
    id,
    createdAt: new Date().toISOString(),
    title,
    description,
    category: category as ReelJob["category"],
    publishPrismic: form.get("publish") === "on",
    filename: safeFilename(filename, contentType === "video/quicktime" ? "mov" : "mp4"),
    contentType: contentType as ReelJob["contentType"],
    size,
    chunkCount: Math.ceil(size / UPLOAD_CHUNK_SIZE),
    prismic: { status: "pending" },
    instagram: instagram
      ? isInstagramConfigured()
        ? { status: "pending" }
        : { status: "error", message: "Instagram nie jest skonfigurowany." }
      : { status: "skipped" },
    tiktok: tiktok
      ? isTikTokConfigured()
        ? { status: "pending" }
        : { status: "error", message: "TikTok nie jest skonfigurowany." }
      : { status: "skipped" }
  };

  if (cover instanceof File && cover.size > 0) {
    if (!COVER_TYPES.includes(cover.type as (typeof COVER_TYPES)[number])) {
      return jsonError("Okładka musi być w formacie JPG, PNG lub WebP.", 400);
    }
    if (cover.size > MAX_COVER_SIZE) {
      return jsonError("Okładka może mieć maksymalnie 3 MB.", 400);
    }
    const ext = cover.type.split("/")[1].replace("jpeg", "jpg");
    job.cover = { filename: safeFilename(cover.name, ext), contentType: cover.type };
    await panelStore().setBytes(coverKey(id), new Uint8Array(await cover.arrayBuffer()));
  }

  await saveJob(job);

  return NextResponse.json(
    { job: toPublicJob(job), chunkSize: UPLOAD_CHUNK_SIZE, chunkCount: job.chunkCount },
    { headers: { "Cache-Control": "no-store" } }
  );
}
