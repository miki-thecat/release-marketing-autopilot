# Design

## Web v2 direction

The marketing site adopts the current **Tailark OSS Dusk** visual system rather than maintaining a ReleaseFlow-specific art direction. Dusk Landing Page Two supplies the page foundation; its Hero Section Two, Features Five, FAQs One, Call to Action Two, and Footer Two inform the retained sections. The page keeps Dusk's dark palette, rounded proof frames, quiet borders, large type, generous spacing, and restrained transitions.

### Stable site layer

- Dusk-derived global navigation, container/grid system, typography hierarchy, tokens, spacing, radii, borders, cards, FAQ, CTA, footer, and responsive breakpoints
- Product proof frames for the ReleaseFlow workflow: create, plan, processing, render, and Release Pack
- Keyboard focus, route links, semantic landmarks, and reduced-motion behavior

These patterns live in `src/components/marketing/` and accept content rather than encoding a specific future input model.

### Provisional product layer

Current hero messaging, product promise, target audiences, capability wording, FAQ answers, CTA labels, and internal demo metadata live together in `src/content/marketing.ts`. They describe the current recording-to-Release-Pack workflow and can change without rebuilding the stable page system.

`ProductEntryAdapter` owns the homepage-to-product transition. It currently explains the browser-recording input and links to `/create`; it does not duplicate upload or generation logic. If ReleaseFlow adopts a different input model, this adapter and the provisional content module are the intended replacement points.

### Page architecture

1. Dusk navigation and hero
2. Product entry adapter
3. Internal Feature Launch, Product Launch, and Changelog proof examples
4. Before/after transformation
5. Three-step process
6. Dusk Features Five-style product walkthrough
7. Current use-case hypotheses
8. Dusk FAQ
9. Dusk CTA Two
10. Dusk Footer Two

The existing working product remains at `/create`. The homepage uses Server Components by default; only the mobile dialog, demo tabs, and before/after switch are client components.

### ReleaseFlow-specific custom areas

Custom work is limited to adapting Dusk proof frames with the real ReleaseFlow input and outputs, preserving the `ProductEntryAdapter`, and keeping the content module replaceable. All examples are explicitly internal demos; production media can replace their representative proof surfaces without changing the Dusk layout.

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
