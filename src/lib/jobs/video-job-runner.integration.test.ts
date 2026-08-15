import { createReadStream } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { ReleaseRecord } from "@/lib/release/types";
import { LocalStorageProvider } from "@/lib/storage/local-storage";
import { FFmpegVideoRenderer } from "@/lib/video/ffmpeg-renderer";
import { runProcess } from "@/lib/video/process";
import { probeVideo } from "@/lib/video/probe";
import { VideoJobRunner } from "./video-job-runner";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe("real release pipeline", () => {
  it("turns an uploaded MP4 into a playable 1080p release video", async () => {
    const root = await mkdtemp(path.join(process.cwd(), ".releaseflow-test-"));
    temporaryDirectories.push(root);
    const source = path.join(root, "source.mp4");
    await runProcess("ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-y",
      "-f", "lavfi", "-i", "testsrc2=size=640x360:rate=30",
      "-t", "1.2", "-c:v", "libx264", "-pix_fmt", "yuv420p", source,
    ], "ffmpeg_failed");

    const id = randomUUID();
    const now = new Date().toISOString();
    const record: ReleaseRecord = {
      id,
      details: {
        featureName: "AI Search",
        description: "Users can now search every project with natural language.",
        productUrl: "https://flowbase.ai",
      },
      stage: "awaiting_upload",
      progress: 0,
      createdAt: now,
      updatedAt: now,
    };
    const storage = new LocalStorageProvider(path.join(root, "releases"));
    await storage.create(record);
    const bytes = await storage.saveInput(id, createReadStream(source));
    expect(bytes).toBeGreaterThan(1_000);

    const runner = new VideoJobRunner(storage, new FFmpegVideoRenderer());
    await runner.run(id);

    const completed = await storage.read(id);
    expect(completed.stage).toBe("completed");
    expect(completed.copy?.xPost).toContain("AI Search");
    expect(await storage.outputExists(id)).toBe(true);
    const outputMetadata = await probeVideo(storage.getOutputPath(id));
    expect(outputMetadata).toMatchObject({ width: 1920, height: 1080, codec: "h264" });
    expect(outputMetadata.duration).toBeGreaterThan(5);
  });
});
