import type { ReleaseErrorCode } from "./types";

export class ReleaseError extends Error {
  constructor(
    public readonly code: ReleaseErrorCode,
    message: string,
    public readonly status = 400,
  ) {
    super(message);
    this.name = "ReleaseError";
  }
}

export function toReleaseError(error: unknown): ReleaseError {
  if (error instanceof ReleaseError) return error;
  const message = error instanceof Error ? error.message : "Unknown release error";
  return new ReleaseError("internal_error", message, 500);
}
