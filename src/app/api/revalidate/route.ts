import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const querySecret = request.nextUrl.searchParams.get("secret");
  let bodySecret: string | undefined;

  try {
    const body: unknown = await request.json();

    if (
      typeof body === "object" &&
      body !== null &&
      "secret" in body &&
      typeof body.secret === "string"
    ) {
      bodySecret = body.secret;
    }
  } catch {
    // The webhook may not include a JSON body when the secret is in the URL.
  }

  const secret = querySecret || bodySecret;

  if (
    !process.env.PRISMIC_REVALIDATE_SECRET ||
    secret !== process.env.PRISMIC_REVALIDATE_SECRET
  ) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  revalidateTag("prismic", "max");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
