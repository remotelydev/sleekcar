import { NextResponse, type NextRequest } from "next/server";
import {
  PanelConfigError,
  attemptLogin,
  isAuthConfigured,
  jsonError,
  loginBlockedFor,
  rejectCrossSite,
  setSessionCookie
} from "@/lib/panel/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const crossSite = rejectCrossSite(request);
  if (crossSite) return crossSite;

  if (!isAuthConfigured()) {
    return jsonError("Panel nie jest skonfigurowany (brak zmiennych PANEL_*).", 503);
  }

  const blockedUntil = await loginBlockedFor(request);
  if (blockedUntil) {
    const minutes = Math.max(1, Math.ceil((blockedUntil - Date.now()) / 60_000));
    return jsonError(`Za dużo nieudanych prób. Spróbuj za ${minutes} min.`, 429);
  }

  let password = "";
  let code = "";
  try {
    const body = (await request.json()) as { password?: unknown; code?: unknown };
    password = typeof body.password === "string" ? body.password.slice(0, 200) : "";
    code = typeof body.code === "string" ? body.code.replace(/\s/g, "").slice(0, 6) : "";
  } catch {
    return jsonError("Nieprawidłowe dane.", 400);
  }

  try {
    if (!(await attemptLogin(request, password, code))) {
      return jsonError("Nieprawidłowe hasło lub kod.", 401);
    }
  } catch (error) {
    if (error instanceof PanelConfigError) {
      return jsonError(error.message, 503);
    }
    throw error;
  }

  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  setSessionCookie(response);
  return response;
}
