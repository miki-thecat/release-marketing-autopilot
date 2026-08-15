import { toReleaseError } from "@/lib/release/errors";
import { storage } from "@/lib/storage/local-storage";
import { assertReleaseId } from "@/lib/storage/safe-path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  try {
    const { id } = await context.params;
    const release = await storage.read(assertReleaseId(id));
    return Response.json({ release }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const releaseError = toReleaseError(error);
    return Response.json({ errorCode: releaseError.code }, { status: releaseError.status });
  }
}
