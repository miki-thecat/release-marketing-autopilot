import { describe, expect, it } from "vitest";
import { marketingContent } from "./marketing";

describe("marketing content boundary", () => {
  it("keeps demo and navigation identifiers unique", () => {
    expect(new Set(marketingContent.demos.map((demo) => demo.id)).size).toBe(marketingContent.demos.length);
    expect(new Set(marketingContent.nav.map((item) => item.href)).size).toBe(marketingContent.nav.length);
  });

  it("labels proof examples as internal demos in the stable page copy", () => {
    expect(marketingContent.proof.eyebrow.toLowerCase()).toContain("internal demo");
    expect(marketingContent.faq.items.at(-1)?.answer.toLowerCase()).toContain("internal demos");
  });
});
