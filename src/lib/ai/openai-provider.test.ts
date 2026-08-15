import { mkdtemp, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type OpenAI from "openai";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OpenAILLMProvider } from "./openai-provider";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) =>
    rm(directory, { recursive: true, force: true })));
});

describe("OpenAI release planning", () => {
  it("parses structured output, includes timestamped images, and clamps it", async () => {
    const root = await mkdtemp(path.join(process.cwd(), ".openai-test-"));
    temporaryDirectories.push(root);
    const framePath = path.join(root, "frame.jpg");
    await writeFile(framePath, Buffer.from([0xff, 0xd8, 0xff, 0xd9]));
    const parse = vi.fn().mockResolvedValue({
      output_parsed: {
        targetDurationSeconds: 22,
        hook: "Search anything in Flowbase.",
        cta: "AI Search — available now.",
        segments: [{
          sourceStart: -2,
          sourceEnd: 50,
          purpose: "Show instant results",
          caption: "Answers across every project",
          focusX: 1.4,
          focusY: -1,
          zoom: 2,
        }],
        xPost: "We shipped AI Search. Find anything across your workspace in seconds.",
        linkedinPost: "We shipped AI Search so teams can find work across every project in seconds.",
      },
      usage: { input_tokens: 120, output_tokens: 80 },
    });
    const client = { responses: { parse } } as unknown as OpenAI;
    const provider = new OpenAILLMProvider({ client, model: "test-model" });

    const result = await provider.generateReleasePlan({
      releaseId: "test-release",
      details: { featureName: "AI Search", description: "横断検索を追加しました。" },
      metadata: { duration: 18, width: 1280, height: 720, codec: "h264", format: "mov,mp4" },
      frames: [{ timestamp: 6.25, filePath: framePath }],
      regenerationCount: 0,
    });

    expect(result.segments[0]).toMatchObject({
      sourceStart: 0,
      sourceEnd: 17,
      focusX: 1,
      focusY: 0,
      zoom: 1.3,
    });
    const request = parse.mock.calls[0][0];
    expect(request.model).toBe("test-model");
    expect(request.input[0].content).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: "input_text", text: expect.stringContaining("6.250") }),
      expect.objectContaining({ type: "input_image", image_url: expect.stringMatching(/^data:image\/jpeg;base64,/) }),
    ]));
  });
});
