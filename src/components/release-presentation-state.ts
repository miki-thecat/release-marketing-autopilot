export type SocialTab = "x" | "linkedin";

export interface ReleasePresentationState {
  socialTab: SocialTab;
  copied?: SocialTab;
  showRegenerate: boolean;
}

export const initialReleasePresentationState: ReleasePresentationState = {
  socialTab: "x",
  copied: undefined,
  showRegenerate: false,
};

export function createNewReleasePresentationState(): ReleasePresentationState {
  return { ...initialReleasePresentationState };
}
