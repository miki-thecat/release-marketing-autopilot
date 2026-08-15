export interface AIUsage {
  releaseId: string;
  provider: string;
  operation: string;
  inputTokens?: number;
  outputTokens?: number;
  frameCount: number;
  approximateCostUsd: number;
  durationMs: number;
}

export function logAIUsage(usage: AIUsage): void {
  console.info(JSON.stringify({ type: "ai_usage", ...usage, timestamp: new Date().toISOString() }));
}
