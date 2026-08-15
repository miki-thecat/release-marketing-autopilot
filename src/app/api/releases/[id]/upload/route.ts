import { acceptedUploadMimeTypes, limits } from "@/lib/config";
import { track } from "@/lib/analytics/track";
import { releaseJobRunner } from "@/lib/jobs/video-job-runner";
import { ReleaseError, toReleaseError } from "@/lib/release/errors";
import { storage } from "@/lib/storage/local-storage";
import { assertReleaseId, sanitizeOriginalFileName } from "@/lib/storage/safe-path";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  try {
    const { id: rawId } = await context.params;
    const id = assertReleaseId(rawId);
    await storage.read(id);

    const contentType = request.headers.get("content-type")?.split(";")[0].toLowerCase() || "";
    if (!acceptedUploadMimeTypes.has(contentType)) {
      throw new ReleaseError("unsupported_format", "Upload content type is not supported", 415);
    }
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > limits.maxUploadBytes) {
      throw new ReleaseError("file_too_large", "Upload exceeds byte limit", 413);
    }
    if (!request.body) throw new ReleaseError("invalid_request", "Upload body is missing");

    const originalFileName = sanitizeOriginalFileName(request.headers.get("x-file-name"));
    await storage.update(id, { stage: "uploading", progress: 8, originalFileName });
    track("upload_started", { releaseId: id, contentLength });
    const inputBytes = await storage.saveInput(
      id,
      request.body as unknown as AsyncIterable<Uint8Array>,
    );
    await storage.update(id, { inputBytes, progress: 16 });
    track("upload_completed", { releaseId: id, inputBytes });
    track("generation_started", { releaseId: id });
    releaseJobRunner.start(id);
    return Response.json({ releaseId: id }, { status: 202 });
  } catch (error) {
    const releaseError = toReleaseError(error);
    return Response.json({ errorCode: releaseError.code }, { status: releaseError.status });
  }
}
