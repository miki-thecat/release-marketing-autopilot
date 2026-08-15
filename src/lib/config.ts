import path from "node:path";

export const limits = Object.freeze({
  maxUploadBytes: 500 * 1024 * 1024,
  maxDurationSeconds: 90,
  minWidth: 320,
  minHeight: 180,
  maxWidth: 7680,
  maxHeight: 4320,
  maxFeatureNameLength: 80,
  maxDescriptionLength: 600,
  maxProductUrlLength: 300,
  maxRegenerationInstructionLength: 300,
});

export const renderConfig = Object.freeze({
  width: 1920,
  height: 1080,
  fps: 30,
  introSeconds: 2,
  maxSourceSeconds: 25,
  outroSeconds: 3,
  minTargetSeconds: 15,
  maxTargetSeconds: 30,
  maxSegments: 4,
  maxZoom: 1.3,
});

export const frameExtractionConfig = Object.freeze({
  minimumTypicalFrames: 8,
  targetFrames: 12,
  maximumFrames: 20,
  width: 800,
  jpegQuality: 5,
  sceneThreshold: 0.28,
  cacheVersion: 1,
});

export const runtimeConfig = Object.freeze({
  dataDirectory:
    process.env.RELEASEFLOW_DATA_DIR || path.join(process.cwd(), "data", "releases"),
  ffmpegPath: process.env.FFMPEG_PATH || "ffmpeg",
  ffprobePath: process.env.FFPROBE_PATH || "ffprobe",
  openAIModel: process.env.OPENAI_MODEL || "gpt-5.4-mini",
});

export const acceptedUploadMimeTypes = new Set([
  "video/mp4",
  "video/quicktime",
  "application/octet-stream",
]);
