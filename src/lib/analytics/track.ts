export type AnalyticsEvent =
  | "release_started"
  | "upload_started"
  | "upload_completed"
  | "feature_details_completed"
  | "generation_started"
  | "generation_completed"
  | "video_previewed"
  | "video_downloaded"
  | "x_copy_copied"
  | "linkedin_copy_copied"
  | "regenerate_clicked"
  | "pricing_viewed"
  | "founder_plan_clicked";

export function track(event: AnalyticsEvent, properties: Record<string, unknown> = {}): void {
  const payload = { type: "analytics", event, properties, timestamp: new Date().toISOString() };
  console.info(JSON.stringify(payload));
}
