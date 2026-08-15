export interface AIUsage {
  releaseId: string;
  provider: string;
  model?: string;
  operation: "plan_release" | "regenerate_release";
  inputTokens?: number;
  outputTokens?: number;
  frameCount: number;
  approximateCostUsd?: number;
  durationMs: number;
  regenerationCount: number;
}

export function logAIUsage(usage: AIUsage): void {
  console.info(JSON.stringify({ type: "ai_usage", ...usage, timestamp: new Date().toISOString() }));
}
