import type { ReleaseCopy, ReleaseDetails, VideoMetadata } from "@/lib/release/types";

export interface RenderRequest {
  frameType: "browser";
  inputPath: string;
  outputPath: string;
  details: ReleaseDetails;
  copy: ReleaseCopy;
  metadata: VideoMetadata;
}

export interface VideoRenderer {
  render(request: RenderRequest): Promise<void>;
}
