import { access, mkdtemp, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { afterEach, describe, expect, it } from "vitest";
import { runProcess } from "./process";
import { FFmpegFrameExtractor } from "./frame-extractor";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) =>
    rm(directory, { recursive: true, force: true })));
});

describe("representative frame extraction", () => {
  it("creates a bounded timestamped JPEG set and reuses its cache", async () => {
    const root = await mkdtemp(path.join(process.cwd(), ".frames-test-"));
    temporaryDirectories.push(root);
    const source = path.join(root, "scenes.mp4");
    await runProcess("ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-y",
      "-f", "lavfi", "-i", "color=c=0x102840:s=640x360:r=30:d=1",
      "-f", "lavfi", "-i", "color=c=0x24a878:s=640x360:r=30:d=1",
      "-f", "lavfi", "-i", "color=c=0xf2c14e:s=640x360:r=30:d=1",
      "-filter_complex", "[0:v][1:v][2:v]concat=n=3:v=1:a=0[out]",
      "-map", "[out]", "-c:v", "libx264", "-pix_fmt", "yuv420p", source,
    ], "ffmpeg_failed");

    const extractor = new FFmpegFrameExtractor();
    const framesDirectory = path.join(root, "frames");
    const first = await extractor.extract(source, framesDirectory, 3);
    const second = await extractor.extract(source, framesDirectory, 3);

    expect(first.length).toBeGreaterThanOrEqual(8);
    expect(first.length).toBeLessThanOrEqual(20);
    expect(second).toEqual(first);
    expect(first.map((frame) => frame.timestamp)).toEqual(
      [...first.map((frame) => frame.timestamp)].sort((a, b) => a - b),
    );
    await Promise.all(first.map((frame) => access(frame.filePath)));
    const metadata = await sharp(first[0].filePath).metadata();
    expect(metadata.format).toBe("jpeg");
    expect(metadata.width).toBeLessThanOrEqual(800);
  });
});
