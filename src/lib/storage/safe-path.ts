import path from "node:path";
import { ReleaseError } from "@/lib/release/errors";

const RELEASE_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function assertReleaseId(id: string): string {
  if (!RELEASE_ID_PATTERN.test(id)) {
    throw new ReleaseError("release_not_found", "Invalid release identifier", 404);
  }
  return id;
}

export function sanitizeOriginalFileName(fileName: string | null): string {
  const leaf = path.basename(fileName || "recording.mp4");
  return leaf
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}._ -]+/gu, "_")
    .replace(/\s+/g, " ")
    .slice(0, 120) || "recording.mp4";
}

export function containedPath(root: string, ...parts: string[]): string {
  const resolvedRoot = path.resolve(root);
  const target = path.resolve(resolvedRoot, ...parts);
  if (target !== resolvedRoot && !target.startsWith(`${resolvedRoot}${path.sep}`)) {
    throw new ReleaseError("invalid_request", "Unsafe storage path");
  }
  return target;
}
