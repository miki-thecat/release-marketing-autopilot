import { mkdir, mkdtemp, rename, rm } from "node:fs/promises";
import path from "node:path";
import { renderConfig, runtimeConfig } from "@/lib/config";
import { ReleaseError } from "@/lib/release/errors";
import { createRenderAssets } from "./assets";
import { runProcess } from "./process";
import type { RenderRequest, VideoRenderer } from "./renderer";

export class FFmpegVideoRenderer implements VideoRenderer {
  async render(request: RenderRequest): Promise<void> {
    if (request.frameType !== "browser") {
      throw new ReleaseError("rendering_failed", "Unsupported frame type", 500);
    }

    const jobDirectory = path.dirname(request.outputPath);
    await mkdir(jobDirectory, { recursive: true });
    const temporaryDirectory = await mkdtemp(path.join(jobDirectory, ".render-"));
    const temporaryOutput = path.join(temporaryDirectory, "rendered.mp4");
    const mainDuration = Math.min(request.metadata.duration, renderConfig.maxRecordingSeconds);

    try {
      const assets = await createRenderAssets(temporaryDirectory, request.details, request.copy);
      const filter = createFilter(mainDuration);
      await runProcess(
        runtimeConfig.ffmpegPath,
        [
          "-hide_banner",
          "-loglevel", "error",
          "-y",
          "-loop", "1", "-t", String(renderConfig.introSeconds), "-i", assets.intro,
          "-i", request.inputPath,
          "-loop", "1", "-t", String(mainDuration), "-i", assets.browser,
          "-loop", "1", "-t", String(renderConfig.outroSeconds), "-i", assets.outro,
          "-filter_complex", filter,
          "-map", "[out]",
          "-an",
          "-c:v", "libx264",
          "-preset", "medium",
          "-crf", "20",
          "-pix_fmt", "yuv420p",
          "-movflags", "+faststart",
          temporaryOutput,
        ],
        "ffmpeg_failed",
      );
      await rename(temporaryOutput, request.outputPath);
    } catch (error) {
      if (error instanceof ReleaseError) throw error;
      throw new ReleaseError(
        "rendering_failed",
        error instanceof Error ? error.message : "Renderer failed",
        500,
      );
    } finally {
      await rm(temporaryDirectory, { recursive: true, force: true });
    }
  }
}

function createFilter(mainDuration: number): string {
  const introFadeOut = Math.max(0, renderConfig.introSeconds - 0.45);
  const outroFadeOut = Math.max(0, renderConfig.outroSeconds - 0.5);
  return [
    `[0:v]trim=duration=${renderConfig.introSeconds},setpts=PTS-STARTPTS,fps=${renderConfig.fps},format=yuv420p,fade=t=in:st=0:d=0.45,fade=t=out:st=${introFadeOut}:d=0.45[intro]`,
    `[1:v]trim=start=0:duration=${mainDuration},setpts=PTS-STARTPTS,scale=1510:850:force_original_aspect_ratio=decrease,pad=1510:850:(ow-iw)/2:(oh-ih)/2:color=0x0f172a,scale=1490:838,crop=1460:821:x='15+8*sin(t*0.35)':y='8+5*cos(t*0.32)',fps=${renderConfig.fps}[screen]`,
    `[2:v]trim=duration=${mainDuration},setpts=PTS-STARTPTS,fps=${renderConfig.fps},format=rgba[background]`,
    `[background][screen]overlay=230:185:shortest=1,format=yuv420p[main]`,
    `[3:v]trim=duration=${renderConfig.outroSeconds},setpts=PTS-STARTPTS,fps=${renderConfig.fps},format=yuv420p,fade=t=in:st=0:d=0.45,fade=t=out:st=${outroFadeOut}:d=0.5[outro]`,
    `[intro][main][outro]concat=n=3:v=1:a=0,format=yuv420p[out]`,
  ].join(";");
}
