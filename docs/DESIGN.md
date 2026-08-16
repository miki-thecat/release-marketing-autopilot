# Design

## Product shape

The product is a focused release workflow rather than a generic video editor: create a release, watch processing progress, then use the completed Release Pack.

The generated video uses an opening hook, selected browser-recording segments with restrained focus or zoom and captions, and a CTA outro. Regeneration accepts a single focused instruction and reuses the existing upload and frame cache.

## Language

- UI messages live in `src/locales/ja.ts` and `src/locales/en.ts`.
- `NEXT_PUBLIC_DEFAULT_LOCALE` selects the default; the development fallback is Japanese.
- External release content is English-first.

## Design decisions still open

- TODO: Document visual identity, typography, and detailed component behavior when those decisions are made.
- TODO: Define the interaction and content requirements for any future multilingual output.
