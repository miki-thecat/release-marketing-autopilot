import { readFile } from "node:fs/promises";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { openAIReleaseStoryboardSchema, validateStoryboard } from "@/lib/release/validation";
import type { ReleaseStoryboard } from "@/lib/release/types";
import type { LLMProvider, ReleasePlanningInput } from "./llm-provider";
import { logAIUsage } from "./usage";

const SYSTEM_INSTRUCTIONS = `You are the release director for a founder-led SaaS product.
Create one clear product release story from the supplied feature details and timestamped recording frames.

The objective is NOT to summarize the whole recording. Create the clearest 15–30 second product release story that demonstrates the shipped feature. Prefer 2–4 substantial source segments and favor the visible result over setup. Avoid loading states, dead time, long cursor travel, repetition, and irrelevant navigation.

Use concrete product language. The hook and CTA must describe this release without generic AI-marketing clichés. Captions should be short and optional; return null when a scene is clearer without one. Focus coordinates are normalized from 0 to 1. Use subtle zoom values from 1.0 to 1.3.

Write xPost and linkedinPost in natural English even when the feature description is Japanese. The X post must be concise, founder-voiced, useful, under 280 characters, with no excessive emoji. The LinkedIn post can explain slightly more but must stay concise and professional without corporate fluff.

All timestamps must refer to the supplied source duration. Return only the required structured output.`;

export interface OpenAIProviderOptions {
  apiKey?: string;
  model: string;
  client?: OpenAI;
}

export class OpenAILLMProvider implements LLMProvider {
  readonly name = "openai";
  readonly model: string;
  private readonly client: OpenAI;

  constructor(options: OpenAIProviderOptions) {
    if (!options.client && !options.apiKey) {
      throw new Error("OPENAI_API_KEY is required for OpenAILLMProvider");
    }
    this.model = options.model;
    this.client = options.client ?? new OpenAI({
      apiKey: options.apiKey,
      timeout: 45_000,
      maxRetries: 1,
    });
  }

  async generateReleasePlan(input: ReleasePlanningInput): Promise<ReleaseStoryboard> {
    const startedAt = Date.now();
    const imageParts = await Promise.all(input.frames.map(async (frame) => ({
      timestamp: frame.timestamp,
      imageUrl: `data:image/jpeg;base64,${(await readFile(frame.filePath)).toString("base64")}`,
    })));
    const response = await this.client.responses.parse({
      model: this.model,
      instructions: SYSTEM_INSTRUCTIONS,
      input: [{
        role: "user",
        content: [
          { type: "input_text", text: createPlanningPrompt(input) },
          ...imageParts.flatMap((frame) => [
            { type: "input_text" as const, text: `Representative frame at ${frame.timestamp.toFixed(3)} seconds` },
            { type: "input_image" as const, image_url: frame.imageUrl, detail: "low" as const },
          ]),
        ],
      }],
      text: {
        format: zodTextFormat(openAIReleaseStoryboardSchema, "release_storyboard"),
      },
    });
    if (!response.output_parsed) {
      throw new Error("OpenAI returned no parsed release storyboard");
    }
    const storyboard = validateStoryboard(response.output_parsed, input.metadata.duration);
    logAIUsage({
      releaseId: input.releaseId,
      provider: this.name,
      model: this.model,
      operation: input.regeneration ? "regenerate_release" : "plan_release",
      inputTokens: response.usage?.input_tokens,
      outputTokens: response.usage?.output_tokens,
      frameCount: input.frames.length,
      durationMs: Date.now() - startedAt,
      regenerationCount: input.regenerationCount,
    });
    return storyboard;
  }
}

function createPlanningPrompt(input: ReleasePlanningInput): string {
  const base = [
    `Feature name: ${input.details.featureName}`,
    `Feature description: ${input.details.description}`,
    `Product URL: ${input.details.productUrl || "not provided"}`,
    `Source duration: ${input.metadata.duration.toFixed(3)} seconds`,
    `Source resolution: ${input.metadata.width}x${input.metadata.height}`,
    `Frame timestamps: ${input.frames.map((frame) => frame.timestamp.toFixed(3)).join(", ")}`,
  ];
  if (input.regeneration && input.currentStoryboard) {
    base.push(
      `This is regeneration number ${input.regenerationCount}.`,
      `Regeneration instruction: ${regenerationInstruction(input)}`,
      `Current validated storyboard: ${JSON.stringify(input.currentStoryboard)}`,
      "Revise the current storyboard rather than ignoring it, while still using the recording frames as evidence.",
    );
  }
  return base.join("\n");
}

function regenerationInstruction(input: ReleasePlanningInput): string {
  const request = input.regeneration!;
  const instructions = {
    shorter: "Make the finished release story shorter.",
    energetic: "Make the pacing more energetic while keeping cuts coherent.",
    focus_results: "Focus more strongly on the visible result and payoff.",
    less_text: "Use less on-screen text and shorter copy.",
    professional: "Use a more professional, restrained tone.",
    custom: request.customInstruction || "Refine the release story.",
  };
  return instructions[request.intent];
}
