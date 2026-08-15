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
  it("clamps timestamps, zoom, focus, scene count, text, and total duration", () => {
    const result = validateStoryboard(storyboard({
      targetDurationSeconds: 200,
      hook: "h".repeat(200),
      segments: Array.from({ length: 8 }, (_, index) => ({
        sourceStart: index === 0 ? -12 : index * 5,
        sourceEnd: index === 0 ? 400 : index * 5 + 10,
        purpose: "result",
        caption: "caption",
        focusX: 4,
        focusY: -3,
        zoom: 9,
      })),
    }), 60);

    expect(result.targetDurationSeconds).toBe(30);
    expect(result.hook).toHaveLength(80);
    expect(result.segments.length).toBeLessThanOrEqual(4);
    expect(result.segments[0]).toMatchObject({
      sourceStart: 0,
      sourceEnd: 25,
      focusX: 1,
      focusY: 0,
      zoom: 1.3,
    });
    expect(totalDuration(result.segments)).toBeLessThanOrEqual(25);
  });

  it("repairs reversed ranges and drops unusably short ranges", () => {
    const result = validateStoryboard(storyboard({
      segments: [
        { sourceStart: 8, sourceEnd: 3, purpose: "result", caption: null, focusX: null, focusY: null, zoom: null },
        { sourceStart: 9.9, sourceEnd: 10, purpose: "dead", caption: null, focusX: null, focusY: null, zoom: null },
      ],
    }), 10);
    expect(result.segments).toHaveLength(1);
    expect(result.segments[0]).toMatchObject({ sourceStart: 3, sourceEnd: 8 });
  });

  it("rejects a structurally invalid model response", () => {
    expect(() => validateStoryboard({ hook: "Missing fields" }, 10)).toThrow("structure");
  });
});

function storyboard(overrides: Record<string, unknown> = {}) {
  return {
    targetDurationSeconds: 20,
    hook: "Meet AI Search.",
    cta: "Available now.",
    segments: [{
      sourceStart: 0,
      sourceEnd: 5,
      purpose: "Show result",
      caption: null,
      focusX: null,
      focusY: null,
      zoom: null,
    }],
    xPost: "We shipped AI Search.",
    linkedinPost: "We shipped AI Search for faster project discovery.",
    ...overrides,
  };
}

function totalDuration(segments: Array<{ sourceStart: number; sourceEnd: number }>): number {
  return segments.reduce((sum, segment) => sum + segment.sourceEnd - segment.sourceStart, 0);
}
