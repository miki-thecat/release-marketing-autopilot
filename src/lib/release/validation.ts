import { limits } from "@/lib/config";
import { ReleaseError } from "./errors";
import type {
  ReleaseDetails,
  Storyboard,
  StoryboardSegment,
  VideoMetadata,
} from "./types";

export function validateReleaseDetails(input: unknown): ReleaseDetails {
  if (!input || typeof input !== "object") {
    throw new ReleaseError("invalid_request", "Release details must be an object");
  }

  const candidate = input as Record<string, unknown>;
  const featureName = cleanText(candidate.featureName, limits.maxFeatureNameLength);
  const description = cleanText(candidate.description, limits.maxDescriptionLength);
  const productUrl = cleanText(candidate.productUrl, limits.maxProductUrlLength, true);

  if (!featureName || !description) {
    throw new ReleaseError("invalid_request", "Feature name and description are required");
  }

  if (productUrl) {
    let parsed: URL;
    try {
      parsed = new URL(productUrl);
    } catch {
      throw new ReleaseError("invalid_request", "Product URL is invalid");
    }
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      throw new ReleaseError("invalid_request", "Product URL protocol is invalid");
    }
  }

  return { featureName, description, ...(productUrl ? { productUrl } : {}) };
}

function cleanText(value: unknown, maxLength: number, optional = false): string {
  if (value === undefined || value === null) return optional ? "" : "";
  if (typeof value !== "string") {
    throw new ReleaseError("invalid_request", "Text field has an invalid type");
  }
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function validateVideoMetadata(metadata: VideoMetadata): VideoMetadata {
  const isMovFamily = metadata.format
    .split(",")
    .some((format) => ["mov", "mp4", "m4a", "3gp", "3g2", "mj2"].includes(format));
  if (!isMovFamily) {
    throw new ReleaseError("unsupported_format", "Media container is not MP4/MOV");
  }
  if (!Number.isFinite(metadata.duration) || metadata.duration <= 0) {
    throw new ReleaseError("corrupt_media", "Video duration is invalid");
  }
  if (metadata.duration > limits.maxDurationSeconds) {
    throw new ReleaseError("video_too_long", "Video exceeds duration limit");
  }
  if (
    !Number.isInteger(metadata.width) ||
    !Number.isInteger(metadata.height) ||
    metadata.width < limits.minWidth ||
    metadata.height < limits.minHeight ||
    metadata.width > limits.maxWidth ||
    metadata.height > limits.maxHeight
  ) {
    throw new ReleaseError("invalid_resolution", "Video resolution is invalid");
  }
  return metadata;
}

export function validateStoryboard(input: Storyboard, sourceDuration: number): Storyboard {
  const duration = clamp(finite(input.targetDuration, 20), 5, 30);
  const segments = (Array.isArray(input.segments) ? input.segments : [])
    .slice(0, 12)
    .map((segment) => validateSegment(segment, sourceDuration))
    .filter((segment) => segment.end - segment.start >= 0.25);

  return {
    targetDuration: duration,
    hook: String(input.hook || "New feature").trim().slice(0, 80),
    cta: String(input.cta || "Available now").trim().slice(0, 80),
    segments,
  };
}

function validateSegment(segment: StoryboardSegment, sourceDuration: number): StoryboardSegment {
  const start = clamp(finite(segment.start, 0), 0, sourceDuration);
  const end = clamp(finite(segment.end, start), start, sourceDuration);
  return {
    start,
    end,
    purpose: String(segment.purpose || "feature demonstration").slice(0, 120),
    focusX: clamp(finite(segment.focusX, 0.5), 0, 1),
    focusY: clamp(finite(segment.focusY, 0.5), 0, 1),
    zoom: clamp(finite(segment.zoom, 1), 1, 1.5),
  };
}

function finite(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
