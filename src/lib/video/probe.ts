import { runtimeConfig } from "@/lib/config";
import { ReleaseError } from "@/lib/release/errors";
import type { VideoMetadata } from "@/lib/release/types";
import { validateVideoMetadata } from "@/lib/release/validation";
import { runProcess } from "./process";

interface ProbeOutput {
  format?: { duration?: string; format_name?: string };
  streams?: Array<{ codec_type?: string; codec_name?: string; width?: number; height?: number }>;
}

export async function probeVideo(filePath: string): Promise<VideoMetadata> {
  const { stdout } = await runProcess(
    runtimeConfig.ffprobePath,
    ["-v", "error", "-show_entries", "format=duration,format_name:stream=codec_type,codec_name,width,height", "-of", "json", filePath],
    "corrupt_media",
  );

  let parsed: ProbeOutput;
  try {
    parsed = JSON.parse(stdout) as ProbeOutput;
  } catch {
    throw new ReleaseError("corrupt_media", "ffprobe returned invalid metadata");
  }
  const video = parsed.streams?.find((stream) => stream.codec_type === "video");
  if (!video) throw new ReleaseError("corrupt_media", "No video stream found");

  return validateVideoMetadata({
    duration: Number(parsed.format?.duration),
    width: Number(video.width),
    height: Number(video.height),
    codec: video.codec_name || "unknown",
    format: parsed.format?.format_name || "unknown",
  });
}
