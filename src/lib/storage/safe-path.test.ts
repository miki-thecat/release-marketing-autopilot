import path from "node:path";
import { describe, expect, it } from "vitest";
import { assertReleaseId, containedPath, sanitizeOriginalFileName } from "./safe-path";

describe("safe file handling", () => {
  it("only accepts v4 UUID release identifiers", () => {
    expect(assertReleaseId("123e4567-e89b-42d3-a456-426614174000")).toContain("123e4567");
    expect(() => assertReleaseId("../../windows/system32")).toThrow("Invalid release");
  });

  it("removes traversal and shell syntax from display-only upload names", () => {
    const name = sanitizeOriginalFileName("../release;$(danger).mp4");
    expect(name).toBe("release_danger_.mp4");
    expect(name).not.toContain("..");
  });

  it("refuses to resolve outside its storage root", () => {
    const root = path.resolve("data", "releases");
    expect(() => containedPath(root, "..", "secrets")).toThrow("Unsafe storage path");
  });
});
