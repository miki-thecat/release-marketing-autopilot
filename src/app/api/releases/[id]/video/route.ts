import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { toReleaseError } from "@/lib/release/errors";
import { ReleaseError } from "@/lib/release/errors";
import { storage } from "@/lib/storage/local-storage";
import { assertReleaseId } from "@/lib/storage/safe-path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  try {
    const { id: rawId } = await context.params;
    const id = assertReleaseId(rawId);
    const release = await storage.read(id);
    if (release.stage !== "completed" || !(await storage.outputExists(id))) {
      throw new ReleaseError("download_missing", "Output video is missing", 404);
    }
    const outputPath = storage.getOutputPath(id);
    const info = await stat(outputPath);
    const download = new URL(request.url).searchParams.get("download") === "1";
    const body = Readable.toWeb(createReadStream(outputPath)) as ReadableStream<Uint8Array>;
    return new Response(body, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": String(info.size),
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="ReleaseFlow-${id.slice(0, 8)}.mp4"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    const releaseError = toReleaseError(error);
    return Response.json({ errorCode: releaseError.code }, { status: releaseError.status });
  }
}
