import { createHmac, randomBytes, scrypt, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { panelStore } from "./storage";

/*
 * Owner panel authentication: password (scrypt hash in env) + TOTP code from an authenticator
 * app, then a signed, HttpOnly, SameSite=Strict session cookie. Failed logins are rate limited
 * per IP and globally. Mutating API calls also check Origin and a custom header (CSRF).
 */

const SESSION_TTL_SECONDS = 12 * 60 * 60;
const IP_MAX_FAILURES = 5;
const IP_WINDOW_MS = 15 * 60 * 1000;
const GLOBAL_MAX_FAILURES = 20;
const GLOBAL_WINDOW_MS = 60 * 60 * 1000;

export const CSRF_HEADER = "x-panel-request";

export const SESSION_COOKIE =
  process.env.NODE_ENV === "production" ? "__Host-sc_panel" : "sc_panel";

export class PanelConfigError extends Error {}

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new PanelConfigError(`Brak zmiennej środowiskowej ${name}.`);
  }
  return value;
}

function sessionSecret() {
  const secret = requiredEnv("PANEL_SESSION_SECRET");
  if (secret.length < 32) {
    throw new PanelConfigError("PANEL_SESSION_SECRET musi mieć co najmniej 32 znaki.");
  }
  return secret;
}

export function isAuthConfigured() {
  return Boolean(
    process.env.PANEL_PASSWORD_HASH &&
      process.env.PANEL_TOTP_SECRET &&
      (process.env.PANEL_SESSION_SECRET?.length ?? 0) >= 32
  );
}

// ---------------------------------------------------------------------------------------------
// Password: "scrypt:N:r:p:<salt base64url>:<hash base64url>" (see scripts/panel-setup.mjs)

function scryptAsync(password: string, salt: Buffer, length: number, N: number, r: number, p: number) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, length, { N, r, p, maxmem: 256 * 1024 * 1024 }, (error, key) =>
      error ? reject(error) : resolve(key)
    );
  });
}

async function verifyPassword(password: string) {
  const [scheme, n, r, p, salt, hash] = requiredEnv("PANEL_PASSWORD_HASH").split(":");
  if (scheme !== "scrypt" || !salt || !hash) {
    throw new PanelConfigError("PANEL_PASSWORD_HASH ma zły format.");
  }
  const expected = Buffer.from(hash, "base64url");
  const actual = await scryptAsync(
    password,
    Buffer.from(salt, "base64url"),
    expected.length,
    Number(n),
    Number(r),
    Number(p)
  );
  return timingSafeEqual(actual, expected);
}

// ---------------------------------------------------------------------------------------------
// TOTP (RFC 6238, SHA-1, 6 digits, 30 s), accepts one step of clock drift and blocks code reuse.

function base32Decode(input: string) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const clean = input.toUpperCase().replace(/[\s=-]/g, "");
  let bits = "";
  for (const char of clean) {
    const value = alphabet.indexOf(char);
    if (value === -1) {
      throw new PanelConfigError("PANEL_TOTP_SECRET nie jest poprawnym base32.");
    }
    bits += value.toString(2).padStart(5, "0");
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

function totpAt(secret: Buffer, counter: number) {
  const message = Buffer.alloc(8);
  message.writeBigUInt64BE(BigInt(counter));
  const digest = createHmac("sha1", secret).update(message).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const code = (digest.readUInt32BE(offset) & 0x7fffffff) % 1_000_000;
  return code.toString().padStart(6, "0");
}

/** Returns the matched time step, or null. The caller marks it used after a full login. */
async function verifyTotp(code: string) {
  if (!/^\d{6}$/.test(code)) {
    return null;
  }
  const secret = base32Decode(requiredEnv("PANEL_TOTP_SECRET"));
  const now = Math.floor(Date.now() / 30_000);
  const last = (await panelStore().getJSON<{ counter: number }>("auth/totp-last"))?.counter ?? 0;

  for (const counter of [now - 1, now, now + 1]) {
    if (counter > last && timingSafeEqual(Buffer.from(totpAt(secret, counter)), Buffer.from(code))) {
      return counter;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------------------------
// Rate limiting of failed logins.

type Bucket = { count: number; resetAt: number };

function clientIp(request: NextRequest) {
  return (
    request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function ipKey(ip: string) {
  return `auth/fail-ip/${createHmac("sha256", "ip").update(ip).digest("hex").slice(0, 32)}`;
}

async function readBucket(key: string) {
  const bucket = await panelStore().getJSON<Bucket>(key);
  return bucket && bucket.resetAt > Date.now() ? bucket : null;
}

export async function loginBlockedFor(request: NextRequest) {
  const [ipBucket, globalBucket] = await Promise.all([
    readBucket(ipKey(clientIp(request))),
    readBucket("auth/fail-global")
  ]);
  if (ipBucket && ipBucket.count >= IP_MAX_FAILURES) {
    return ipBucket.resetAt;
  }
  if (globalBucket && globalBucket.count >= GLOBAL_MAX_FAILURES) {
    return globalBucket.resetAt;
  }
  return null;
}

async function recordFailure(request: NextRequest) {
  const store = panelStore();
  const now = Date.now();
  for (const [key, windowMs] of [
    [ipKey(clientIp(request)), IP_WINDOW_MS],
    ["auth/fail-global", GLOBAL_WINDOW_MS]
  ] as const) {
    const bucket = (await readBucket(key)) ?? { count: 0, resetAt: now + windowMs };
    bucket.count += 1;
    await store.setJSON(key, bucket);
  }
}

export async function attemptLogin(request: NextRequest, password: string, code: string) {
  // Check both factors, always, so the response time does not reveal which one failed.
  const [passwordOk, totpCounter] = await Promise.all([
    verifyPassword(password).catch((error) => {
      if (error instanceof PanelConfigError) throw error;
      return false;
    }),
    verifyTotp(code)
  ]);

  if (passwordOk && totpCounter !== null) {
    const store = panelStore();
    await store.setJSON("auth/totp-last", { counter: totpCounter });
    await store.delete(ipKey(clientIp(request)));
    return true;
  }

  await recordFailure(request);
  return false;
}

// ---------------------------------------------------------------------------------------------
// Session cookie: base64url(JSON payload) + "." + HMAC-SHA256 signature.

type SessionPayload = { iat: number; exp: number; nonce: string };

function sign(value: string) {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

export function createSessionValue() {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
    nonce: randomBytes(12).toString("base64url")
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionValue(value: string | undefined) {
  if (!value || !isAuthConfigured()) {
    return false;
  }
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) {
    return false;
  }
  const expected = Buffer.from(sign(encoded));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return false;
  }
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function setSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, createSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0
  });
}

/** For server components: is the current visitor logged in? */
export async function hasPanelSession() {
  const store = await cookies();
  return verifySessionValue(store.get(SESSION_COOKIE)?.value);
}

// ---------------------------------------------------------------------------------------------
// Request guards for API routes.

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!origin || !host) {
    return false;
  }
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

/** CSRF check for every state-changing request, including login. */
export function rejectCrossSite(request: NextRequest) {
  if (!sameOrigin(request) || request.headers.get(CSRF_HEADER) !== "1") {
    return jsonError("Niedozwolone żądanie.", 403);
  }
  return null;
}

/** Session + CSRF check for panel API routes. Returns an error response or null. */
export function guardPanelRequest(request: NextRequest, { mutating = true } = {}) {
  if (mutating) {
    const crossSite = rejectCrossSite(request);
    if (crossSite) return crossSite;
  }
  if (!verifySessionValue(request.cookies.get(SESSION_COOKIE)?.value)) {
    return jsonError("Sesja wygasła. Zaloguj się ponownie.", 401);
  }
  return null;
}
