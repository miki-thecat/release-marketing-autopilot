import { mkdir, mkdtemp, rename, rm } from "node:fs/promises";
import path from "node:path";
import { renderConfig, runtimeConfig } from "@/lib/config";
import { ReleaseError } from "@/lib/release/errors";
import type { StoryboardSegment } from "@/lib/release/types";
import { createRenderAssets } from "./assets";
import { runProcess } from "./process";
import type { RenderRequest, VideoRenderer } from "./renderer";

export class FFmpegVideoRenderer implements VideoRenderer {
  async render(request: RenderRequest): Promise<void> {
    if (request.frameType !== "browser") {
      throw new ReleaseError("rendering_failed", "Unsupported frame type", 500);
    }
    if (request.storyboard.segments.length === 0) {
      throw new ReleaseError("rendering_failed", "Storyboard contains no renderable segments", 500);
    }

    const jobDirectory = path.dirname(request.outputPath);
    await mkdir(jobDirectory, { recursive: true });
    const temporaryDirectory = await mkdtemp(path.join(jobDirectory, ".render-"));
    const temporaryOutput = path.join(temporaryDirectory, "rendered.mp4");
    const mainDuration = request.storyboard.segments.reduce(
      (total, segment) => total + segment.sourceEnd - segment.sourceStart,
      0,
    );

    try {
      const assets = await createRenderAssets(
        temporaryDirectory,
        request.details,
        request.storyboard,
      );
      const args = [
        "-hide_banner", "-loglevel", "error", "-y",
        "-loop", "1", "-t", String(renderConfig.introSeconds), "-i", assets.intro,
        "-i", request.inputPath,
        "-loop", "1", "-t", String(mainDuration), "-i", assets.browser,
        "-loop", "1", "-t", String(renderConfig.outroSeconds), "-i", assets.outro,
      ];
      request.storyboard.segments.forEach((segment, index) => {
        args.push(
          "-loop", "1",
          "-t", String(segment.sourceEnd - segment.sourceStart),
          "-i", assets.captions[index],
        );
      });
      args.push(
        "-filter_complex", createFilter(request.storyboard.segments, mainDuration),
        "-map", "[out]",
        "-an",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "20",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        temporaryOutput,
      );
      await runProcess(runtimeConfig.ffmpegPath, args, "ffmpeg_failed");
      await rm(request.outputPath, { force: true });
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

export function createFilter(segments: StoryboardSegment[], mainDuration: number): string {
  const introFadeOut = Math.max(0, renderConfig.introSeconds - 0.45);
  const outroFadeOut = Math.max(0, renderConfig.outroSeconds - 0.5);
  const filters = [
    `[0:v]trim=duration=${renderConfig.introSeconds},setpts=PTS-STARTPTS,fps=${renderConfig.fps},format=yuv420p,fade=t=in:st=0:d=0.45,fade=t=out:st=${introFadeOut}:d=0.45[intro]`,
  ];

  if (segments.length === 1) {
    filters.push(`[2:v]trim=duration=${mainDuration},setpts=PTS-STARTPTS,fps=${renderConfig.fps},format=rgba[bg0]`);
  } else {
    const backgroundLabels = segments.map((_, index) => `[bg${index}]`).join("");
    filters.push(`[2:v]trim=duration=${mainDuration},setpts=PTS-STARTPTS,fps=${renderConfig.fps},format=rgba,split=${segments.length}${backgroundLabels}`);
  }

  segments.forEach((segment, index) => {
    const duration = segment.sourceEnd - segment.sourceStart;
    const zoomStep = duration > 0
      ? Math.max(0, segment.zoom - 1) / (duration * renderConfig.fps)
      : 0;
    const zoom = segment.zoom.toFixed(4);
    const focusX = segment.focusX.toFixed(4);
    const focusY = segment.focusY.toFixed(4);
    filters.push(
      `[1:v]trim=start=${segment.sourceStart}:end=${segment.sourceEnd},setpts=PTS-STARTPTS,scale=1510:850:force_original_aspect_ratio=decrease,pad=1510:850:(ow-iw)/2:(oh-ih)/2:color=0x0f172a,zoompan=z='min(1+on*${zoomStep.toFixed(8)},${zoom})':x='max(0,min(iw-iw/zoom,(iw-iw/zoom)*${focusX}))':y='max(0,min(ih-ih/zoom,(ih-ih/zoom)*${focusY}))':d=1:s=1460x821:fps=${renderConfig.fps},format=rgba[screen${index}]`,
      `[bg${index}][screen${index}]overlay=230:185:shortest=1[sceneBase${index}]`,
      `[${index + 4}:v]trim=duration=${duration},setpts=PTS-STARTPTS,fps=${renderConfig.fps},format=rgba[caption${index}]`,
      `[sceneBase${index}][caption${index}]overlay=0:0:shortest=1,format=yuv420p[scene${index}]`,
    );
  });

  filters.push(
    `[3:v]trim=duration=${renderConfig.outroSeconds},setpts=PTS-STARTPTS,fps=${renderConfig.fps},format=yuv420p,fade=t=in:st=0:d=0.45,fade=t=out:st=${outroFadeOut}:d=0.5[outro]`,
  );
  const concatenatedInputs = [
    "[intro]",
    ...segments.map((_, index) => `[scene${index}]`),
    "[outro]",
  ].join("");
  filters.push(`${concatenatedInputs}concat=n=${segments.length + 2}:v=1:a=0,format=yuv420p[out]`);
  return filters.join(";");
}
