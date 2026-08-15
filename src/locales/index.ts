import { en, type Messages } from "./en";
import { ja } from "./ja";

export const locales = { ja, en } as const;
export type Locale = keyof typeof locales;
export type { Messages };

const configuredDefault = process.env.NEXT_PUBLIC_DEFAULT_LOCALE;

// Change this environment variable (or this fallback) before global validation.
export const DEFAULT_LOCALE: Locale = configuredDefault === "en" ? "en" : "ja";

export function isLocale(value: string | null): value is Locale {
  return value === "ja" || value === "en";
}
