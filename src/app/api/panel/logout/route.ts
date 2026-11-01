import { NextResponse, type NextRequest } from "next/server";
import { clearSessionCookie, rejectCrossSite } from "@/lib/panel/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const crossSite = rejectCrossSite(request);
  if (crossSite) return crossSite;

  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  clearSessionCookie(response);
  return response;
}
