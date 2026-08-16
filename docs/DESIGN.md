# Design

## Web v2 direction

The marketing site uses **technical precision × editorial launch energy**: a near-black and warm off-white foundation, a restrained signal-orange accent, large type, generous spacing, product-scale proof surfaces, and deliberate light/dark chapter changes. Motion is limited to short state transitions and is disabled by the existing reduced-motion rule.

### Stable site layer

- Global navigation and native-dialog mobile navigation
- Container/grid system, typography hierarchy, spacing, color tokens, lines, and radii
- Section labels and headings, light/dark chapter rhythm, and responsive breakpoints
- Demo-gallery frame, before/after shell, process cards, FAQ details, final CTA, and footer
- Keyboard focus, route links, semantic landmarks, and reduced-motion behavior

These patterns live in `src/components/marketing/` and accept content rather than encoding a specific future input model.

### Provisional product layer

Current hero messaging, product promise, target audiences, capability wording, FAQ answers, CTA labels, and internal demo metadata live together in `src/content/marketing.ts`. They describe the current recording-to-Release-Pack workflow and can change without rebuilding the stable page system.

`ProductEntryAdapter` owns the homepage-to-product transition. It currently explains the browser-recording input and links to `/create`; it does not duplicate upload or generation logic. If ReleaseFlow adopts a different input model, this adapter and the provisional content module are the intended replacement points.

### Page architecture

1. Navigation
2. Product-first hero and entry adapter
3. Internal example/output proof gallery
4. Before/after transformation
5. Three-step process
6. Dark capability proof chapter
7. Current use-case hypotheses
8. FAQ
9. Final CTA
10. Footer

The existing working product remains at `/create`. The homepage uses Server Components by default; only the mobile dialog, demo tabs, and before/after switch are client components.

### ReleaseFlow-specific custom areas

Custom design effort is concentrated in the product-entry console, ReleaseFlow demo canvas, coordinated-output capability visual, and transformation shell. Navigation, links, FAQ disclosure, buttons, and responsive grids use native or simple proven primitives.

All gallery items are explicitly internal demos. Their CSS-rendered surfaces are intentionally provisional and should be replaced with production media when available without changing gallery layout or interaction.

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
