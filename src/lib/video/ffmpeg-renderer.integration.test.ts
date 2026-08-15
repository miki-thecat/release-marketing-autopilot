import { mkdtemp, rm } from "node:fs/promises";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { FFmpegVideoRenderer } from "./ffmpeg-renderer";
import { probeVideo } from "./probe";
import { runProcess } from "./process";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) =>
    rm(directory, { recursive: true, force: true })));
});

describe("multi-segment FFmpeg rendering", () => {
  it("renders selected source ranges with safe focus and zoom into playable H.264", async () => {
    const root = await mkdtemp(path.join(process.cwd(), ".renderer-test-"));
    temporaryDirectories.push(root);
    const inputPath = path.join(root, "input.mp4");
    const outputPath = path.join(root, "output.mp4");
    await runProcess("ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-y",
      "-f", "lavfi", "-i", "testsrc2=size=640x360:rate=30",
      "-t", "3.2", "-c:v", "libx264", "-pix_fmt", "yuv420p", inputPath,
    ], "ffmpeg_failed");

    await new FFmpegVideoRenderer().render({
      frameType: "browser",
      inputPath,
      outputPath,
      details: { featureName: "AI Search", productUrl: "https://flowbase.ai", description: "Search everything." },
      metadata: { duration: 3.2, width: 640, height: 360, codec: "h264", format: "mov,mp4" },
      storyboard: {
        targetDurationSeconds: 15,
        hook: "Search anything in Flowbase.",
        cta: "AI Search — available now.",
        segments: [
          { sourceStart: 0, sourceEnd: 0.9, purpose: "setup", caption: "Search naturally", focusX: 0.25, focusY: 0.4, zoom: 1.08 },
          { sourceStart: 1.8, sourceEnd: 3.1, purpose: "result", caption: "Find the answer", focusX: 0.8, focusY: 0.6, zoom: 1.2 },
        ],
        xPost: "We shipped AI Search.",
        linkedinPost: "We shipped AI Search.",
      },
    });

    const metadata = await probeVideo(outputPath);
    expect(metadata).toMatchObject({ width: 1920, height: 1080, codec: "h264" });
    expect(metadata.duration).toBeGreaterThan(6.5);
    expect(metadata.duration).toBeLessThan(8.5);
  });
});
