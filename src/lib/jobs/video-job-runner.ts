import { getDeterministicLLMProvider, getLLMProvider } from "@/lib/ai";
import type { LLMProvider, ReleasePlanningInput } from "@/lib/ai/llm-provider";
import { track } from "@/lib/analytics/track";
import { toReleaseError } from "@/lib/release/errors";
import type { RegenerationRequest, ReleaseCopy, ReleaseStoryboard } from "@/lib/release/types";
import type { StorageProvider } from "@/lib/storage/storage-provider";
import { storage } from "@/lib/storage/local-storage";
import { FFmpegVideoRenderer } from "@/lib/video/ffmpeg-renderer";
import { FFmpegFrameExtractor, type FrameExtractor } from "@/lib/video/frame-extractor";
import { probeVideo } from "@/lib/video/probe";
import type { VideoRenderer } from "@/lib/video/renderer";

type ProviderFactory = () => LLMProvider;

export class VideoJobRunner {
  private readonly activeJobs = new Set<string>();

  constructor(
    private readonly files: StorageProvider,
    private readonly renderer: VideoRenderer,
    private readonly frameExtractor: FrameExtractor = new FFmpegFrameExtractor(),
    private readonly providerFactory: ProviderFactory = getLLMProvider,
  ) {}

  start(releaseId: string, regeneration?: RegenerationRequest): boolean {
    if (this.activeJobs.has(releaseId)) return false;
    this.activeJobs.add(releaseId);
    void this.run(releaseId, regeneration).finally(() => this.activeJobs.delete(releaseId));
    return true;
  }

  async run(releaseId: string, regeneration?: RegenerationRequest): Promise<void> {
    try {
      const release = await this.files.update(releaseId, {
        stage: "validating",
        progress: 20,
        errorCode: undefined,
      });
      const inputPath = this.files.getInputPath(releaseId);
      const metadata = await probeVideo(inputPath);
      await this.files.update(releaseId, { metadata, stage: "analyzing", progress: 32 });

      const frames = await this.frameExtractor.extract(
        inputPath,
        this.files.getFramesDirectory(releaseId),
        metadata.duration,
      );
      await this.files.update(releaseId, { stage: "planning", progress: 48 });

      const regenerationCount = (release.regenerationCount || 0) + (regeneration ? 1 : 0);
      const planningInput: ReleasePlanningInput = {
        releaseId,
        details: release.details,
        metadata,
        frames,
        ...(regeneration && release.storyboard
          ? { currentStoryboard: release.storyboard, regeneration }
          : {}),
        regenerationCount,
      };
      const { storyboard, provider, fallbackUsed } = await planWithFallback(
        this.providerFactory(),
        planningInput,
      );
      const copy: ReleaseCopy = {
        hook: storyboard.hook,
        cta: storyboard.cta,
        xPost: storyboard.xPost,
        linkedinPost: storyboard.linkedinPost,
        provider: provider.name,
        ...(provider.model ? { model: provider.model } : {}),
      };

      await this.files.update(releaseId, {
        storyboard,
        copy,
        regenerationCount,
        planning: {
          provider: provider.name,
          ...(provider.model ? { model: provider.model } : {}),
          frameCount: frames.length,
          fallbackUsed,
        },
        stage: "rendering",
        progress: 64,
      });
      await this.renderer.render({
        frameType: "browser",
        inputPath,
        outputPath: this.files.getOutputPath(releaseId),
        details: release.details,
        storyboard,
        metadata,
      });

      await this.files.update(releaseId, { stage: "finalizing", progress: 94 });
      const videoRevision = (release.videoRevision || 0) + 1;
      await this.files.update(releaseId, {
        stage: "completed",
        progress: 100,
        videoRevision,
        videoUrl: `/api/releases/${releaseId}/video?v=${videoRevision}`,
      });
      track(regeneration ? "regeneration_completed" : "generation_completed", {
        releaseId,
        provider: provider.name,
        regenerationCount,
      });
    } catch (error) {
      const releaseError = toReleaseError(error);
      console.error(JSON.stringify({
        type: "release_job_error",
        releaseId,
        code: releaseError.code,
        message: releaseError.message.slice(0, 500),
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

async function planWithFallback(
  primary: LLMProvider,
  input: ReleasePlanningInput,
): Promise<{ storyboard: ReleaseStoryboard; provider: LLMProvider; fallbackUsed: boolean }> {
  try {
    const storyboard = await primary.generateReleasePlan(input);
    return {
      storyboard,
      provider: primary,
      fallbackUsed: primary.name === "deterministic",
    };
  } catch (error) {
    console.error(JSON.stringify({
      type: "ai_provider_failure",
      releaseId: input.releaseId,
      provider: primary.name,
      model: primary.model,
      operation: input.regeneration ? "regenerate_release" : "plan_release",
      message: error instanceof Error ? error.message.slice(0, 500) : "AI planning failed",
    }));
    const fallback = getDeterministicLLMProvider();
    if (primary === fallback) throw error;
    return {
      storyboard: await fallback.generateReleasePlan(input),
      provider: fallback,
      fallbackUsed: true,
    };
  }
}

export const releaseJobRunner = new VideoJobRunner(storage, new FFmpegVideoRenderer());
