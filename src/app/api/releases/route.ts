import { randomUUID } from "node:crypto";
import { track } from "@/lib/analytics/track";
import { toReleaseError } from "@/lib/release/errors";
import type { ReleaseRecord } from "@/lib/release/types";
import { validateReleaseDetails } from "@/lib/release/validation";
import { storage } from "@/lib/storage/local-storage";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  try {
    const details = validateReleaseDetails(await request.json());
    const now = new Date().toISOString();
    const record: ReleaseRecord = {
      id: randomUUID(),
      details,
      stage: "awaiting_upload",
      progress: 0,
      createdAt: now,
      updatedAt: now,
    };
    await storage.create(record);
    track("release_started", { releaseId: record.id });
    track("feature_details_completed", { releaseId: record.id });
    return Response.json({ release: record }, { status: 201 });
  } catch (error) {
    const releaseError = toReleaseError(error);
    return Response.json({ errorCode: releaseError.code }, { status: releaseError.status });
  }
}
