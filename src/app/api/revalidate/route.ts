import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.PRISMIC_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  revalidateTag("prismic", "max");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
