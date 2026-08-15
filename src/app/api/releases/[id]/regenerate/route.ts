import { releaseJobRunner } from "@/lib/jobs/video-job-runner";
import { ReleaseError, toReleaseError } from "@/lib/release/errors";
import { validateRegenerationRequest } from "@/lib/release/validation";
import { storage } from "@/lib/storage/local-storage";
import { assertReleaseId } from "@/lib/storage/safe-path";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  try {
    const { id: rawId } = await context.params;
    const id = assertReleaseId(rawId);
    const release = await storage.read(id);
    if (release.stage !== "completed" || !release.storyboard || !release.metadata) {
      throw new ReleaseError("invalid_request", "Only a completed release can be regenerated", 409);
    }
    const regeneration = validateRegenerationRequest(await request.json());
    if (!releaseJobRunner.start(id, regeneration)) {
      throw new ReleaseError("invalid_request", "A release job is already running", 409);
    }
    return Response.json({ release }, { status: 202 });
  } catch (error) {
    const releaseError = toReleaseError(error);
    return Response.json({ errorCode: releaseError.code }, { status: releaseError.status });
  }
}
