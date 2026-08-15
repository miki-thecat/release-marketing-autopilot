import { runtimeConfig } from "@/lib/config";
import { DeterministicLLMProvider } from "./deterministic-provider";
import type { LLMProvider } from "./llm-provider";
import { OpenAILLMProvider } from "./openai-provider";

const deterministicProvider = new DeterministicLLMProvider();
let openAIProvider: OpenAILLMProvider | undefined;

export function getLLMProvider(): LLMProvider {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return deterministicProvider;
  openAIProvider ??= new OpenAILLMProvider({ apiKey, model: runtimeConfig.openAIModel });
  return openAIProvider;
}

export function getDeterministicLLMProvider(): DeterministicLLMProvider {
  return deterministicProvider;
}
