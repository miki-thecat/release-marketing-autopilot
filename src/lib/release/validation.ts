import { z } from "zod";
import { limits, renderConfig } from "@/lib/config";
import { ReleaseError } from "./errors";
import type {
  RegenerationRequest,
  ReleaseDetails,
  ReleaseStoryboard,
  StoryboardSegment,
  VideoMetadata,
} from "./types";

export const openAIReleaseStoryboardSchema = z.object({
  targetDurationSeconds: z.number(),
  hook: z.string(),
  cta: z.string(),
  segments: z.array(z.object({
    sourceStart: z.number(),
    sourceEnd: z.number(),
    purpose: z.string(),
    caption: z.string().nullable(),
    focusX: z.number().nullable(),
    focusY: z.number().nullable(),
    zoom: z.number().nullable(),
  })),
  xPost: z.string(),
  linkedinPost: z.string(),
});

const regenerationIntents = new Set([
  "shorter",
  "energetic",
  "focus_results",
  "less_text",
  "professional",
  "custom",
]);

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

export function validateRegenerationRequest(input: unknown): RegenerationRequest {
  if (!input || typeof input !== "object") {
    throw new ReleaseError("invalid_request", "Regeneration request must be an object");
  }
  const candidate = input as Record<string, unknown>;
  if (typeof candidate.intent !== "string" || !regenerationIntents.has(candidate.intent)) {
    throw new ReleaseError("invalid_request", "Regeneration intent is invalid");
  }
  const customInstruction = cleanText(
    candidate.customInstruction,
    limits.maxRegenerationInstructionLength,
    true,
  );
  if (candidate.intent === "custom" && !customInstruction) {
    throw new ReleaseError("invalid_request", "Custom instruction is required");
  }
  return {
    intent: candidate.intent as RegenerationRequest["intent"],
    ...(customInstruction ? { customInstruction } : {}),
  };
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

export function validateStoryboard(input: unknown, sourceDuration: number): ReleaseStoryboard {
  const parsed = openAIReleaseStoryboardSchema.safeParse(input);
  if (!parsed.success) {
    throw new ReleaseError("invalid_request", "AI storyboard has an invalid structure");
  }
  if (!Number.isFinite(sourceDuration) || sourceDuration <= 0) {
    throw new ReleaseError("corrupt_media", "Source duration is invalid");
  }

  const candidate = parsed.data;
  const targetDurationSeconds = clamp(
    finite(candidate.targetDurationSeconds, 20),
    renderConfig.minTargetSeconds,
    renderConfig.maxTargetSeconds,
  );
  const sourceBudget = Math.min(
    renderConfig.maxSourceSeconds,
    Math.max(1, targetDurationSeconds - renderConfig.introSeconds - renderConfig.outroSeconds),
  );
  const minimumSegmentDuration = Math.min(1, sourceDuration);
  const segments: StoryboardSegment[] = [];
  let selectedDuration = 0;

  for (const rawSegment of candidate.segments.slice(0, renderConfig.maxSegments)) {
    let start = clamp(finite(rawSegment.sourceStart, 0), 0, sourceDuration);
    let end = clamp(finite(rawSegment.sourceEnd, start), 0, sourceDuration);
    if (end < start) [start, end] = [end, start];

    const remaining = sourceBudget - selectedDuration;
    if (remaining < minimumSegmentDuration) break;
    end = Math.min(end, start + remaining);
    if (end - start < minimumSegmentDuration) continue;

    segments.push({
      sourceStart: roundTime(start),
      sourceEnd: roundTime(end),
      purpose: boundedText(rawSegment.purpose, "Feature demonstration", 120),
      ...(rawSegment.caption ? { caption: boundedText(rawSegment.caption, "", 90) } : {}),
      focusX: clamp(finite(rawSegment.focusX, 0.5), 0, 1),
      focusY: clamp(finite(rawSegment.focusY, 0.5), 0, 1),
      zoom: clamp(finite(rawSegment.zoom, 1), 1, renderConfig.maxZoom),
    });
    selectedDuration += end - start;
  }

  if (segments.length === 0) {
    segments.push({
      sourceStart: 0,
      sourceEnd: roundTime(Math.min(sourceDuration, sourceBudget)),
      purpose: "Feature demonstration",
      focusX: 0.5,
      focusY: 0.5,
      zoom: 1,
    });
  }

  return {
    targetDurationSeconds,
    hook: boundedText(candidate.hook, "See what’s new.", 80),
    cta: boundedText(candidate.cta, "Available now.", 80),
    segments,
    xPost: boundedCopy(candidate.xPost, "A new feature is available now.", 280),
    linkedinPost: boundedCopy(candidate.linkedinPost, "A new feature is available now.", 1_200),
  };
}

function boundedText(value: string, fallback: string, maxLength: number): string {
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
  return (cleaned || fallback).slice(0, maxLength);
}

function boundedCopy(value: string, fallback: string, maxLength: number): string {
  const cleaned = value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return (cleaned || fallback).slice(0, maxLength);
}

function finite(value: number | null, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function roundTime(value: number): number {
  return Math.round(value * 1_000) / 1_000;
}
