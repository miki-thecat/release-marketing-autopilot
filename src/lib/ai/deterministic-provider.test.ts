import { describe, expect, it } from "vitest";
import { DeterministicLLMProvider } from "./deterministic-provider";

const baseInput = {
  releaseId: "test-release",
  details: {
    featureName: "AI Search",
    description: "Users can search across projects, tasks and documents using natural language. Results appear instantly.",
    productUrl: "https://flowbase.ai",
  },
  metadata: {
    duration: 35,
    width: 1920,
    height: 1080,
    codec: "h264",
    format: "mov,mp4,m4a,3gp,3g2,mj2",
  },
  frames: [],
  regenerationCount: 0,
};

describe("deterministic release planning", () => {
  it("creates a valid multi-scene plan and useful English fallback copy", async () => {
    const result = await new DeterministicLLMProvider().generateReleasePlan(baseInput);

    expect(result.xPost).toContain("We just shipped AI Search");
    expect(result.xPost.length).toBeLessThanOrEqual(280);
    expect(result.linkedinPost).toContain("AI Search is available now");
    expect(result.segments).toHaveLength(3);
    expect(result.segments.every((segment) => segment.sourceEnd > segment.sourceStart)).toBe(true);
  });

  it("regenerates from the current plan without AI", async () => {
    const provider = new DeterministicLLMProvider();
    const currentStoryboard = await provider.generateReleasePlan(baseInput);
    const result = await provider.generateReleasePlan({
      ...baseInput,
      currentStoryboard,
      regeneration: { intent: "shorter" },
      regenerationCount: 1,
    });
    expect(result.targetDurationSeconds).toBe(15);
    expect(result.segments.length).toBeLessThanOrEqual(2);
  });
});
