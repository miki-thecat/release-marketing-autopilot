import type { ReleaseCopy, ReleaseDetails } from "@/lib/release/types";

export interface LLMProvider {
  readonly name: string;
  generateReleaseCopy(releaseId: string, details: ReleaseDetails): Promise<ReleaseCopy>;
}
