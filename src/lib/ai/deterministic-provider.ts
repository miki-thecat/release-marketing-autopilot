import type { ReleaseCopy, ReleaseDetails } from "@/lib/release/types";
import type { LLMProvider } from "./llm-provider";
import { logAIUsage } from "./usage";

export class DeterministicLLMProvider implements LLMProvider {
  readonly name = "deterministic";

  async generateReleaseCopy(releaseId: string, details: ReleaseDetails): Promise<ReleaseCopy> {
    const startedAt = Date.now();
    const featureName = details.featureName.trim();
    const summary = firstSentence(details.description);
    const link = details.productUrl ? `\n\n${details.productUrl}` : "";
    const hook = `Meet ${featureName}.`;
    const cta = `${featureName} — available now.`;
    const xBody = shorten(
      `We just shipped ${featureName}.\n\n${summary}\n\nAvailable now.${link}`,
      280,
    );
    const linkedInBody = shorten(
      `We’ve just shipped ${featureName}.\n\n${summary}\n\nThis release helps teams move from intent to results with less friction. ${featureName} is available now.${link}`,
      900,
    );

    logAIUsage({
      releaseId,
      provider: this.name,
      operation: "generate_release_copy",
      frameCount: 0,
      approximateCostUsd: 0,
      durationMs: Date.now() - startedAt,
    });

    return { hook, cta, xPost: xBody, linkedinPost: linkedInBody, provider: this.name };
  }
}

function firstSentence(description: string): string {
  const clean = description.replace(/\s+/g, " ").trim();
  const match = clean.match(/^.*?[.!?](?:\s|$)/);
  return (match?.[0] || clean).trim().slice(0, 220);
}

function shorten(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}
