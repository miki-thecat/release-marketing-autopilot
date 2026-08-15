export type ReleaseStage =
  | "awaiting_upload"
  | "uploading"
  | "validating"
  | "analyzing"
  | "planning"
  | "rendering"
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

export type RegenerationIntent =
  | "shorter"
  | "energetic"
  | "focus_results"
  | "less_text"
  | "professional"
  | "custom";

export interface RegenerationRequest {
  intent: RegenerationIntent;
  customInstruction?: string;
}

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
  model?: string;
}

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  codec: string;
  format: string;
}

export interface StoryboardSegment {
  sourceStart: number;
  sourceEnd: number;
  purpose: string;
  caption?: string;
  focusX: number;
  focusY: number;
  zoom: number;
}

export interface ReleaseStoryboard {
  targetDurationSeconds: number;
  hook: string;
  cta: string;
  segments: StoryboardSegment[];
  xPost: string;
  linkedinPost: string;
}

export interface ReleasePlanningSummary {
  provider: string;
  model?: string;
  frameCount: number;
  fallbackUsed: boolean;
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
  storyboard?: ReleaseStoryboard;
  planning?: ReleasePlanningSummary;
  copy?: ReleaseCopy;
  regenerationCount?: number;
  videoRevision?: number;
  videoUrl?: string;
  errorCode?: ReleaseErrorCode;
}
