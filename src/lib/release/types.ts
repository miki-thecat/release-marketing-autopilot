export type ReleaseStage =
  | "awaiting_upload"
  | "uploading"
  | "validating"
  | "rendering"
  | "writing_copy"
  | "finalizing"
  | "completed"
  | "failed";

export type ReleaseErrorCode =
  | "unsupported_format"
  | "file_too_large"
  | "video_too_long"
  | "invalid_resolution"
  | "corrupt_media"
  | "ffmpeg_unavailable"
  | "ffmpeg_failed"
  | "rendering_failed"
  | "download_missing"
  | "release_not_found"
  | "invalid_request"
  | "internal_error";

export interface ReleaseDetails {
  featureName: string;
  description: string;
  productUrl?: string;
}

export interface ReleaseCopy {
  hook: string;
  cta: string;
  xPost: string;
  linkedinPost: string;
  provider: string;
}

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  codec: string;
  format: string;
}

export interface ReleaseRecord {
  id: string;
  details: ReleaseDetails;
  stage: ReleaseStage;
  progress: number;
  createdAt: string;
  updatedAt: string;
  originalFileName?: string;
  inputBytes?: number;
  metadata?: VideoMetadata;
  copy?: ReleaseCopy;
  videoUrl?: string;
  errorCode?: ReleaseErrorCode;
}

export interface StoryboardSegment {
  start: number;
  end: number;
  purpose: string;
  focusX: number;
  focusY: number;
  zoom: number;
}

export interface Storyboard {
  targetDuration: number;
  hook: string;
  cta: string;
  segments: StoryboardSegment[];
}
