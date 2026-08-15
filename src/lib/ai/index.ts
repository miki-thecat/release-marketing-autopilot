import { DeterministicLLMProvider } from "./deterministic-provider";
import type { LLMProvider } from "./llm-provider";

let provider: LLMProvider | undefined;

export function getLLMProvider(): LLMProvider {
  provider ??= new DeterministicLLMProvider();
  return provider;
}
