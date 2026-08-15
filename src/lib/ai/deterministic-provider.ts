import type { ReleaseStoryboard } from "@/lib/release/types";
import { validateStoryboard } from "@/lib/release/validation";
import type { LLMProvider, ReleasePlanningInput } from "./llm-provider";
import { logAIUsage } from "./usage";

export class DeterministicLLMProvider implements LLMProvider {
  readonly name = "deterministic";
  readonly model = "local-rules-v1";

  async generateReleasePlan(input: ReleasePlanningInput): Promise<ReleaseStoryboard> {
    const startedAt = Date.now();
    const base = input.currentStoryboard
      ? regenerateExisting(input)
      : createFallbackStoryboard(input);
    const storyboard = validateStoryboard(base, input.metadata.duration);

    logAIUsage({
      releaseId: input.releaseId,
      provider: this.name,
      model: this.model,
      operation: input.regeneration ? "regenerate_release" : "plan_release",
      frameCount: input.frames.length,
      approximateCostUsd: 0,
      durationMs: Date.now() - startedAt,
      regenerationCount: input.regenerationCount,
    });
    return storyboard;
  }
}

function createFallbackStoryboard(input: ReleasePlanningInput) {
  const { details, metadata } = input;
  const featureName = details.featureName.trim();
  const summary = firstSentence(details.description);
  const link = details.productUrl ? `\n\n${details.productUrl}` : "";
  const targetDurationSeconds = metadata.duration < 10 ? 15 : 20;
  const hook = `Meet ${featureName}.`;
  const cta = `${featureName} — available now.`;
  const xPost = shorten(
    `We just shipped ${featureName}.\n\n${summary}\n\nAvailable now.${link}`,
    280,
  );
  const linkedinPost = shorten(
    `We’ve just shipped ${featureName}.\n\n${summary}\n\nThis release makes the core workflow faster and clearer. ${featureName} is available now.${link}`,
    1_200,
  );

  return {
    targetDurationSeconds,
    hook,
    cta,
    segments: fallbackSegments(metadata.duration),
    xPost,
    linkedinPost,
  };
}

function fallbackSegments(duration: number) {
  if (duration <= 7) {
    return [segment(0, duration, "Show the complete feature flow", null, 1.04)];
  }
  if (duration <= 14) {
    return [
      segment(0, Math.min(5, duration), "Establish the feature context", "See what shipped", 1.03),
      segment(Math.max(5, duration - 6), duration, "Show the visible result", "Get to the result faster", 1.1),
    ];
  }
  const middle = duration * 0.48;
  return [
    segment(duration * 0.04, Math.min(duration * 0.04 + 4, duration), "Establish the feature context", "A faster way to work", 1.03),
    segment(Math.max(0, middle - 2.5), Math.min(duration, middle + 2.5), "Show the key interaction", "Built into your workflow", 1.09),
    segment(Math.max(0, duration - 5), duration, "Show the visible result", "See the result", 1.13),
  ];
}

function segment(
  sourceStart: number,
  sourceEnd: number,
  purpose: string,
  caption: string | null,
  zoom: number,
) {
  return { sourceStart, sourceEnd, purpose, caption, focusX: 0.5, focusY: 0.5, zoom };
}

function regenerateExisting(input: ReleasePlanningInput) {
  const current = input.currentStoryboard!;
  const intent = input.regeneration?.intent;
  let segments = current.segments.map((item) => ({
    ...item,
    caption: item.caption ?? null,
  }));
  let targetDurationSeconds = current.targetDurationSeconds;
  let hook = current.hook;
  let cta = current.cta;

  if (intent === "shorter") {
    targetDurationSeconds = 15;
    segments = segments.slice(-2).map((item) => ({
      ...item,
      sourceEnd: Math.min(item.sourceEnd, item.sourceStart + 4),
    }));
  } else if (intent === "energetic") {
    targetDurationSeconds = Math.min(20, current.targetDurationSeconds);
    segments = segments.map((item) => ({ ...item, zoom: Math.min(1.2, item.zoom + 0.06) }));
  } else if (intent === "focus_results") {
    segments = segments.slice(-2);
    hook = `See the result with ${input.details.featureName}.`;
  } else if (intent === "less_text") {
    segments = segments.map((item) => ({ ...item, caption: null }));
    hook = input.details.featureName;
    cta = "Available now.";
  } else if (intent === "professional") {
    hook = `${input.details.featureName}, now available.`;
    cta = `Explore ${input.details.featureName}.`;
  }

  return {
    targetDurationSeconds,
    hook,
    cta,
    segments,
    xPost: current.xPost,
    linkedinPost: current.linkedinPost,
  };
}

function firstSentence(description: string): string {
  const clean = description.replace(/\s+/g, " ").trim();
  const match = clean.match(/^.*?[.!?。！？](?:\s|$)/);
  return (match?.[0] || clean).trim().slice(0, 220);
}

function shorten(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}
