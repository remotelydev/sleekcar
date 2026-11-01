import { NextResponse, type NextRequest } from "next/server";
import { guardPanelRequest, jsonError } from "@/lib/panel/auth";
import { chunkKey, expectedChunkSize, loadJob } from "@/lib/panel/jobs";
import { panelStore } from "@/lib/panel/storage";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string; index: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const denied = guardPanelRequest(request);
  if (denied) return denied;

  const { id, index: rawIndex } = await params;
  const job = await loadJob(id);
  if (!job) {
    return jsonError("Nie znaleziono wgrywanej rolki.", 404);
  }
  if (job.prismic.status !== "pending") {
    return jsonError("Ta rolka została już przetworzona.", 409);
  }

  const index = Number(rawIndex);
  if (!Number.isInteger(index) || index < 0 || index >= job.chunkCount) {
    return jsonError("Nieprawidłowy numer fragmentu.", 400);
  }

  const bytes = new Uint8Array(await request.arrayBuffer());
  if (bytes.length !== expectedChunkSize(job, index)) {
    return jsonError("Nieprawidłowy rozmiar fragmentu.", 400);
  }

  await panelStore().setBytes(chunkKey(job.id, index), bytes);
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
