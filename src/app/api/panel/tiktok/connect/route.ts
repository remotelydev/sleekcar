import { randomBytes } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { guardPanelRequest, jsonError } from "@/lib/panel/auth";
import {
  TIKTOK_STATE_COOKIE,
  isTikTokConfigured,
  signTikTokState,
  tiktokAuthorizeUrl
} from "@/lib/panel/tiktok";

export const dynamic = "force-dynamic";

/** Starts the one-time TikTok OAuth flow (opened as a link from the logged-in panel). */
export async function GET(request: NextRequest) {
  const denied = guardPanelRequest(request, { mutating: false });
  if (denied) return denied;
  if (!isTikTokConfigured()) {
    return jsonError("Brak TIKTOK_CLIENT_KEY lub TIKTOK_CLIENT_SECRET.", 503);
  }

  const state = randomBytes(24).toString("base64url");
  const response = NextResponse.redirect(tiktokAuthorizeUrl(request.nextUrl.origin, state));
  // Lax (not Strict): the cookie must come back on the top-level redirect from tiktok.com.
  response.cookies.set(TIKTOK_STATE_COOKIE, `${state}.${signTikTokState(state)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/panel/tiktok",
    maxAge: 10 * 60
  });
  return response;
}
