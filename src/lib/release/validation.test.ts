import { describe, expect, it } from "vitest";
import { validateReleaseDetails, validateStoryboard, validateVideoMetadata } from "./validation";

describe("release validation", () => {
  it("normalizes safe release details", () => {
    expect(validateReleaseDetails({
      featureName: "  AI\u0000 Search  ",
      description: "Search across   every project.",
      productUrl: "https://flowbase.ai/search",
    })).toEqual({
      featureName: "AI Search",
      description: "Search across every project.",
      productUrl: "https://flowbase.ai/search",
    });
  });

  it("rejects non-web product URLs", () => {
    expect(() => validateReleaseDetails({
      featureName: "AI Search",
      description: "Search projects.",
      productUrl: "file:///etc/passwd",
    })).toThrow("protocol");
  });

  it("validates actual container metadata instead of extensions", () => {
    expect(validateVideoMetadata({
      duration: 12,
      width: 1920,
      height: 1080,
      codec: "h264",
      format: "mov,mp4,m4a,3gp,3g2,mj2",
    }).codec).toBe("h264");
    expect(() => validateVideoMetadata({
      duration: 12,
      width: 1920,
      height: 1080,
      codec: "vp9",
      format: "matroska,webm",
    })).toThrow("container");
  });
});

describe("storyboard guardrails", () => {
  it("clamps untrusted model values to renderer-safe ranges", () => {
    const result = validateStoryboard({
      targetDuration: 200,
      hook: "h".repeat(200),
      cta: "Available now",
      segments: [{
        start: -12,
        end: 400,
        purpose: "result",
        focusX: 4,
        focusY: -3,
        zoom: 9,
      }],
    }, 60);

    expect(result.targetDuration).toBe(30);
    expect(result.hook).toHaveLength(80);
    expect(result.segments[0]).toMatchObject({
      start: 0,
      end: 60,
      focusX: 1,
      focusY: 0,
      zoom: 1.5,
    });
  });
});
