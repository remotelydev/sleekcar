import { timingSafeEqual } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { errorMessage } from "@/lib/panel/jobs";
import { TIKTOK_STATE_COOKIE, exchangeTikTokCode, signTikTokState } from "@/lib/panel/tiktok";

export const dynamic = "force-dynamic";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

function page(message: string, status = 200) {
  const html = `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TikTok</title></head><body style="font-family:system-ui;background:#0a0a0a;color:#f4f4f5;padding:2rem"><p>${escapeHtml(message)}</p><p><a style="color:#f4f4f5" href="/panel/rolki">Wróć do panelu</a></p></body></html>`;
  const response = new NextResponse(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }
  });
  response.cookies.set(TIKTOK_STATE_COOKIE, "", { path: "/api/panel/tiktok", maxAge: 0 });
  return response;
}

/**
 * OAuth redirect target. The SameSite=Strict session cookie is not sent on a redirect from
 * tiktok.com, so this request is authorised by the signed, single-use state cookie that only a
 * logged-in owner can obtain from /connect.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const state = params.get("state") || "";
  const code = params.get("code");
  const [cookieState, signature] = (request.cookies.get(TIKTOK_STATE_COOKIE)?.value || "").split(".");

  const valid =
    Boolean(state && cookieState && signature) &&
    cookieState === state &&
    Buffer.from(signTikTokState(state)).length === Buffer.from(signature).length &&
    timingSafeEqual(Buffer.from(signTikTokState(state)), Buffer.from(signature));

  if (!valid) {
    return page("Nieprawidłowe lub wygasłe żądanie. Spróbuj połączyć TikTok jeszcze raz.", 400);
  }
  if (!code) {
    return page(`TikTok nie udzielił dostępu (${params.get("error_description") || params.get("error") || "anulowano"}).`, 400);
  }

  try {
    await exchangeTikTokCode(code, request.nextUrl.origin);
  } catch (error) {
    return page(errorMessage(error), 502);
  }
  return page("TikTok połączony. Możesz wracać do panelu.");
}
