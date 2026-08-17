import { describe, expect, it } from "vitest";
import { createNewReleasePresentationState } from "./release-presentation-state";

describe("release presentation state", () => {
  it("starts every new release on X without copy or refine state", () => {
    const previousRelease = { socialTab: "linkedin" as const, copied: "linkedin" as const, showRegenerate: true };

    expect(previousRelease.socialTab).toBe("linkedin");
    expect(createNewReleasePresentationState()).toEqual({
      socialTab: "x",
      copied: undefined,
      showRegenerate: false,
    });
  });
});
