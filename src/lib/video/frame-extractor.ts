import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { frameExtractionConfig, runtimeConfig } from "@/lib/config";
import { ReleaseError } from "@/lib/release/errors";
import { runProcess } from "./process";

export interface RepresentativeFrame {
  timestamp: number;
  filePath: string;
}

export interface FrameExtractor {
  extract(inputPath: string, outputDirectory: string, duration: number): Promise<RepresentativeFrame[]>;
}

interface FrameManifest {
  version: number;
  duration: number;
  frames: Array<{ timestamp: number; fileName: string }>;
}

export class FFmpegFrameExtractor implements FrameExtractor {
  async extract(
    inputPath: string,
    outputDirectory: string,
    duration: number,
  ): Promise<RepresentativeFrame[]> {
    if (!Number.isFinite(duration) || duration <= 0) {
      throw new ReleaseError("corrupt_media", "Cannot extract frames from an invalid duration");
    }
    await mkdir(outputDirectory, { recursive: true });
    const cached = await readCachedFrames(outputDirectory, duration);
    if (cached) {
      console.info(JSON.stringify({
        type: "representative_frames_cache_hit",
        frameCount: cached.length,
      }));
      return cached;
    }

    const sceneTimestamps = await detectSceneChanges(inputPath, duration);
    const timestamps = chooseTimestamps(duration, sceneTimestamps);
    const frames: RepresentativeFrame[] = [];

    for (const [index, timestamp] of timestamps.entries()) {
      const fileName = `frame-${String(index + 1).padStart(2, "0")}.jpg`;
      const filePath = path.join(outputDirectory, fileName);
      await runProcess(runtimeConfig.ffmpegPath, [
        "-hide_banner", "-loglevel", "error", "-y",
        "-ss", timestamp.toFixed(3),
        "-i", inputPath,
        "-frames:v", "1",
        "-vf", `scale='min(${frameExtractionConfig.width},iw)':-2`,
        "-q:v", String(frameExtractionConfig.jpegQuality),
        filePath,
      ], "ffmpeg_failed");
      frames.push({ timestamp, filePath });
    }

    const manifest: FrameManifest = {
      version: frameExtractionConfig.cacheVersion,
      duration,
      frames: frames.map((frame) => ({
        timestamp: frame.timestamp,
        fileName: path.basename(frame.filePath),
      })),
    };
    await writeFile(
      path.join(outputDirectory, "manifest.json"),
      JSON.stringify(manifest, null, 2),
      "utf8",
    );
    console.info(JSON.stringify({
      type: "representative_frames_extracted",
      frameCount: frames.length,
      sceneCandidateCount: sceneTimestamps.length,
    }));
    return frames;
  }
}

async function readCachedFrames(
  directory: string,
  duration: number,
): Promise<RepresentativeFrame[] | undefined> {
  try {
    const raw = await readFile(path.join(directory, "manifest.json"), "utf8");
    const manifest = JSON.parse(raw) as FrameManifest;
    if (
      manifest.version !== frameExtractionConfig.cacheVersion ||
      Math.abs(manifest.duration - duration) > 0.01 ||
      !Array.isArray(manifest.frames) ||
      manifest.frames.length === 0 ||
      manifest.frames.length > frameExtractionConfig.maximumFrames
    ) return undefined;

    const frames = manifest.frames.map((frame) => ({
      timestamp: frame.timestamp,
      filePath: path.join(directory, path.basename(frame.fileName)),
    }));
    await Promise.all(frames.map((frame) => access(frame.filePath)));
    return frames;
  } catch {
    return undefined;
  }
}

async function detectSceneChanges(inputPath: string, duration: number): Promise<number[]> {
  try {
    const { stderr } = await runProcess(runtimeConfig.ffmpegPath, [
      "-hide_banner", "-loglevel", "info",
      "-i", inputPath,
      "-vf", `select=gt(scene\\,${frameExtractionConfig.sceneThreshold}),showinfo`,
      "-an", "-f", "null", "-",
    ], "ffmpeg_failed");
    return Array.from(stderr.matchAll(/pts_time:([0-9]+(?:\.[0-9]+)?)/g))
      .map((match) => Number(match[1]))
      .filter((timestamp) => Number.isFinite(timestamp) && timestamp >= 0 && timestamp < duration)
      .slice(0, frameExtractionConfig.maximumFrames * 3);
  } catch (error) {
    if (error instanceof ReleaseError && error.code === "ffmpeg_unavailable") throw error;
    console.warn(JSON.stringify({
      type: "scene_detection_fallback",
      message: error instanceof Error ? error.message.slice(0, 300) : "Scene detection failed",
    }));
    return [];
  }
}

export function chooseTimestamps(duration: number, sceneTimestamps: number[]): number[] {
  const uniformCount = duration >= 50
    ? 14
    : duration >= 20
      ? frameExtractionConfig.targetFrames
      : frameExtractionConfig.minimumTypicalFrames;
  const minimumSpacing = Math.max(0.25, Math.min(1.5, duration / (uniformCount * 2)));
  const selected = Array.from({ length: uniformCount }, (_, index) =>
    ((index + 0.5) / uniformCount) * duration,
  );

  for (const timestamp of sceneTimestamps) {
    if (selected.length >= Math.min(16, frameExtractionConfig.maximumFrames)) break;
    if (selected.every((existing) => Math.abs(existing - timestamp) >= minimumSpacing)) {
      selected.push(timestamp);
    }
  }

  return selected
    .filter((timestamp) => timestamp >= 0 && timestamp < duration)
    .sort((a, b) => a - b)
    .slice(0, frameExtractionConfig.maximumFrames)
    .map((timestamp) => Math.round(timestamp * 1_000) / 1_000);
}
