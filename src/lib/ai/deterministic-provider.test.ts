import { describe, expect, it } from "vitest";
import { DeterministicLLMProvider } from "./deterministic-provider";

describe("deterministic release copy", () => {
  it("creates useful English X and LinkedIn fallbacks without an API key", async () => {
    const result = await new DeterministicLLMProvider().generateReleaseCopy("test-release", {
      featureName: "AI Search",
      description: "Users can search across projects, tasks and documents using natural language. Results appear instantly.",
      productUrl: "https://flowbase.ai",
    });

    expect(result.xPost).toContain("We just shipped AI Search");
    expect(result.xPost.length).toBeLessThanOrEqual(280);
    expect(result.linkedinPost).toContain("AI Search is available now");
    expect(result.provider).toBe("deterministic");
  });
});
