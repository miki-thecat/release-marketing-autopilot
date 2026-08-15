import type {
  RegenerationRequest,
  ReleaseDetails,
  ReleaseStoryboard,
  VideoMetadata,
} from "@/lib/release/types";
import type { RepresentativeFrame } from "@/lib/video/frame-extractor";

export interface ReleasePlanningInput {
  releaseId: string;
  details: ReleaseDetails;
  metadata: VideoMetadata;
  frames: RepresentativeFrame[];
  currentStoryboard?: ReleaseStoryboard;
  regeneration?: RegenerationRequest;
  regenerationCount: number;
}

export interface LLMProvider {
  readonly name: string;
  readonly model?: string;
  generateReleasePlan(input: ReleasePlanningInput): Promise<ReleaseStoryboard>;
}
