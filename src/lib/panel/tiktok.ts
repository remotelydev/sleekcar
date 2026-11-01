import { createHmac } from "crypto";
import { panelStore } from "./storage";
import { readVideoRange, type ReelJob } from "./jobs";

/*
 * TikTok Content Posting API (FILE_UPLOAD):
 * 1. refresh the access token (24 h) from the refresh token (365 days, stored in Blobs),
 * 2. POST /v2/post/publish/video/init/ (direct post) or /inbox/video/init/ (draft in the app),
 * 3. PUT each chunk to the returned upload_url (one chunk per call),
 * 4. POST /v2/post/publish/status/fetch/ until the post is complete.
 */

const API = "https://open.tiktokapis.com";
const TOKEN_KEY = "tiktok/token";
const MIN_CHUNK = 5 * 1024 * 1024;
const TARGET_CHUNK = 10 * 1024 * 1024;
export const TIKTOK_SCOPES = "user.info.basic,video.publish,video.upload";

type StoredToken = {
  accessToken: string;
  expiresAt: number;
  refreshToken: string;
  refreshExpiresAt: number;
  openId?: string;
};

type TokenResponse = {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  refresh_expires_in?: number;
  open_id?: string;
  error?: string;
  error_description?: string;
};

export const TIKTOK_STATE_COOKIE = "sc_tiktok_state";

export function signTikTokState(state: string) {
  return createHmac("sha256", process.env.PANEL_SESSION_SECRET || "")
    .update(`tiktok:${state}`)
    .digest("base64url");
}

export function isTikTokConfigured() {
  return Boolean(process.env.TIKTOK_CLIENT_KEY && process.env.TIKTOK_CLIENT_SECRET);
}

export async function isTikTokConnected() {
  if (process.env.TIKTOK_REFRESH_TOKEN) {
    return true;
  }
  const token = await panelStore().getJSON<StoredToken>(TOKEN_KEY).catch(() => null);
  return Boolean(token && token.refreshExpiresAt > Date.now());
}

export function tiktokPostMode() {
  return process.env.TIKTOK_POST_MODE === "inbox" ? "inbox" : "direct";
}

export function tiktokRedirectUri(origin: string) {
  return `${process.env.NEXT_PUBLIC_SITE_URL || origin}/api/panel/tiktok/callback`;
}

export function tiktokAuthorizeUrl(origin: string, state: string) {
  const url = new URL("https://www.tiktok.com/v2/auth/authorize/");
  url.searchParams.set("client_key", process.env.TIKTOK_CLIENT_KEY || "");
  url.searchParams.set("scope", TIKTOK_SCOPES);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", tiktokRedirectUri(origin));
  url.searchParams.set("state", state);
  return url.toString();
}

async function tokenRequest(params: Record<string, string>) {
  const response = await fetch(`${API}/v2/oauth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY || "",
      client_secret: process.env.TIKTOK_CLIENT_SECRET || "",
      ...params
    }),
    cache: "no-store"
  });
  const body = (await response.json().catch(() => ({}))) as TokenResponse;
  if (!response.ok || body.error || !body.access_token || !body.refresh_token) {
    throw new Error(`TikTok (token): ${body.error_description || body.error || response.statusText}`);
  }
  const now = Date.now();
  const token: StoredToken = {
    accessToken: body.access_token,
    expiresAt: now + (body.expires_in ?? 0) * 1000,
    refreshToken: body.refresh_token,
    refreshExpiresAt: now + (body.refresh_expires_in ?? 0) * 1000,
    openId: body.open_id
  };
  await panelStore().setJSON(TOKEN_KEY, token);
  return token;
}

export function exchangeTikTokCode(code: string, origin: string) {
  return tokenRequest({
    grant_type: "authorization_code",
    code,
    redirect_uri: tiktokRedirectUri(origin)
  });
}

async function accessToken() {
  const stored = await panelStore().getJSON<StoredToken>(TOKEN_KEY);
  if (stored && stored.expiresAt > Date.now() + 5 * 60 * 1000) {
    return stored.accessToken;
  }
  const refreshToken =
    stored && stored.refreshExpiresAt > Date.now()
      ? stored.refreshToken
      : process.env.TIKTOK_REFRESH_TOKEN;
  if (!refreshToken) {
    throw new Error("TikTok nie jest połączony. Kliknij „Połącz TikTok” w panelu.");
  }
  return (await tokenRequest({ grant_type: "refresh_token", refresh_token: refreshToken }))
    .accessToken;
}

async function api<T>(path: string, token: string, body: unknown) {
  const response = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify(body),
    cache: "no-store"
  });
  const json = (await response.json().catch(() => ({}))) as {
    data?: T;
    error?: { code?: string; message?: string };
  };
  if (!response.ok || (json.error?.code && json.error.code !== "ok")) {
    throw new Error(`TikTok: ${json.error?.message || json.error?.code || response.statusText}`);
  }
  return json.data as T;
}

/** TikTok chunk rules: 5-64 MB per chunk, the last one takes the remainder (up to 128 MB). */
function chunkPlan(size: number) {
  if (size <= MIN_CHUNK) {
    return { chunkSize: size, totalChunks: 1 };
  }
  const chunkSize = Math.min(TARGET_CHUNK, size);
  return { chunkSize, totalChunks: Math.max(1, Math.floor(size / chunkSize)) };
}

export type StepResult = { done: boolean; patch: Partial<ReelJob["tiktok"]> };

export async function stepTikTok(job: ReelJob): Promise<StepResult> {
  const state = job.tiktok;
  const token = await accessToken();
  const mode = tiktokPostMode();

  if (!state.publishId || !state.uploadUrl) {
    const { chunkSize, totalChunks } = chunkPlan(job.size);
    const sourceInfo = {
      source: "FILE_UPLOAD",
      video_size: job.size,
      chunk_size: chunkSize,
      total_chunk_count: totalChunks
    };
    let note = "";
    let init: { publish_id: string; upload_url: string };

    if (mode === "direct") {
      const creator = await api<{ privacy_level_options?: string[] }>(
        "/v2/post/publish/creator_info/query/",
        token,
        {}
      );
      const options = creator.privacy_level_options ?? [];
      const wanted = process.env.TIKTOK_PRIVACY_LEVEL || "PUBLIC_TO_EVERYONE";
      const privacy = options.includes(wanted) ? wanted : options.includes("SELF_ONLY") ? "SELF_ONLY" : options[0];
      if (!privacy) {
        throw new Error("TikTok nie zwrócił dostępnych poziomów prywatności dla konta.");
      }
      if (privacy !== wanted) {
        note = ` Uwaga: TikTok pozwolił tylko na „${privacy}” (aplikacja bez audytu publikuje prywatnie).`;
      }
      init = await api("/v2/post/publish/video/init/", token, {
        post_info: {
          title: job.description,
          privacy_level: privacy,
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false
        },
        source_info: sourceInfo
      });
    } else {
      init = await api("/v2/post/publish/inbox/video/init/", token, { source_info: sourceInfo });
    }

    return {
      done: false,
      patch: {
        publishId: init.publish_id,
        uploadUrl: init.upload_url,
        chunkSize,
        totalChunks,
        nextChunk: 0,
        note: note || undefined,
        message: `Wysyłanie do TikToka...${note}`
      }
    };
  }

  const chunkSize = state.chunkSize ?? job.size;
  const totalChunks = state.totalChunks ?? 1;
  const next = state.nextChunk ?? 0;

  if (next < totalChunks) {
    const start = next * chunkSize;
    const end = next === totalChunks - 1 ? job.size : start + chunkSize;
    const bytes = await readVideoRange(job, start, end);
    const response = await fetch(state.uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": job.contentType,
        "Content-Length": String(bytes.length),
        "Content-Range": `bytes ${start}-${end - 1}/${job.size}`
      },
      body: bytes,
      cache: "no-store"
    });
    if (!response.ok) {
      throw new Error(`TikTok odrzucił fragment ${next + 1}/${totalChunks} (${response.status}).`);
    }
    return {
      done: false,
      patch: {
        nextChunk: next + 1,
        message: `Wysłano do TikToka ${next + 1}/${totalChunks}...`
      }
    };
  }

  const status = await api<{ status?: string; fail_reason?: string; publicaly_available_post_id?: string[] }>(
    "/v2/post/publish/status/fetch/",
    token,
    { publish_id: state.publishId }
  );

  switch (status.status) {
    case "PUBLISH_COMPLETE":
      return { done: true, patch: { message: `Opublikowano na TikToku.${state.note ?? ""}` } };
    case "SEND_TO_USER_INBOX":
      return {
        done: true,
        patch: { message: "Wideo czeka w powiadomieniach aplikacji TikTok, dokończ publikację w telefonie." }
      };
    case "FAILED":
      // The upload session is dead, so "Ponów" has to start a new one.
      return {
        done: false,
        patch: {
          publishId: undefined,
          uploadUrl: undefined,
          nextChunk: undefined,
          status: "error",
          message: `TikTok: publikacja nieudana (${status.fail_reason || "brak powodu"}).`
        }
      };
    default:
      return { done: false, patch: { message: "TikTok przetwarza wideo..." } };
  }
}
