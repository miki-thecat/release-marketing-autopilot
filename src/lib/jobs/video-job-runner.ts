import { getLLMProvider } from "@/lib/ai";
import { track } from "@/lib/analytics/track";
import { toReleaseError } from "@/lib/release/errors";
import type { StorageProvider } from "@/lib/storage/storage-provider";
import { storage } from "@/lib/storage/local-storage";
import { FFmpegVideoRenderer } from "@/lib/video/ffmpeg-renderer";
import { probeVideo } from "@/lib/video/probe";
import type { VideoRenderer } from "@/lib/video/renderer";

export class VideoJobRunner {
  private readonly activeJobs = new Set<string>();

  constructor(
    private readonly files: StorageProvider,
    private readonly renderer: VideoRenderer,
  ) {}

  start(releaseId: string): void {
    if (this.activeJobs.has(releaseId)) return;
    this.activeJobs.add(releaseId);
    void this.run(releaseId).finally(() => this.activeJobs.delete(releaseId));
  }

  async run(releaseId: string): Promise<void> {
    try {
      const release = await this.files.update(releaseId, { stage: "validating", progress: 20 });
      const inputPath = this.files.getInputPath(releaseId);
      const metadata = await probeVideo(inputPath);
      await this.files.update(releaseId, { metadata, stage: "rendering", progress: 38 });

      const copy = await getLLMProvider().generateReleaseCopy(releaseId, release.details);
      await this.renderer.render({
        frameType: "browser",
        inputPath,
        outputPath: this.files.getOutputPath(releaseId),
        details: release.details,
        copy,
        metadata,
      });

      await this.files.update(releaseId, { stage: "writing_copy", progress: 82, copy });
      await this.files.update(releaseId, { stage: "finalizing", progress: 94 });
      await this.files.update(releaseId, {
        stage: "completed",
        progress: 100,
        videoUrl: `/api/releases/${releaseId}/video`,
      });
      track("generation_completed", { releaseId, provider: copy.provider });
    } catch (error) {
      const releaseError = toReleaseError(error);
      console.error(JSON.stringify({
        type: "release_job_error",
        releaseId,
        code: releaseError.code,
        message: releaseError.message,
      }));
      try {
        await this.files.update(releaseId, {
          stage: "failed",
          progress: 100,
          errorCode: releaseError.code,
        });
      } catch (storageError) {
        console.error(storageError);
      }
    }
  }
}

export const releaseJobRunner = new VideoJobRunner(storage, new FFmpegVideoRenderer());
