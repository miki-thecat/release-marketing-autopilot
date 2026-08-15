import type { ReleaseDetails, ReleaseStoryboard, VideoMetadata } from "@/lib/release/types";

export interface RenderRequest {
  frameType: "browser";
  inputPath: string;
  outputPath: string;
  details: ReleaseDetails;
  storyboard: ReleaseStoryboard;
  metadata: VideoMetadata;
}

export interface VideoRenderer {
  render(request: RenderRequest): Promise<void>;
}
