# Issue #5 — Tailark Dusk reset

## Goal

Replace the first custom Web v2 art direction with the current Tailark OSS Dusk foundation while preserving the existing ReleaseFlow product route, API/domain behavior, and replaceable marketing content boundary.

## Completed approach

1. Verified the current Tailark OSS registry and inspected Dusk Landing Page Two, Hero Section Two, Features Five, FAQs One, Call to Action Two, and Footer Two.
2. Added only Tailwind v4/PostCSS and Lucide dependencies required for the Dusk source patterns.
3. Replaced the bespoke marketing stylesheet and custom gallery/transform interaction layer with a Dusk-based marketing page. The retained custom surfaces present the real ReleaseFlow flow: create, plan, processing, render, and Release Pack.
4. Preserved `/create`, API/domain modules, the `ProductEntryAdapter`, and the provisional marketing content boundary. The product route now has its Japanese default language server-rendered; the marketing main landmark declares English.
5. Corrected root reduced-motion scrolling and removed the obsolete tab ARIA implementation with the old gallery.

## Validation

- `npm run verify`: lint, typecheck, 20 Vitest tests, and production build passed.
- Browser review: inspected the marketing page at 1440×1000 against the current ngram homepage and confirmed the Dusk foundation is coherent rather than a custom visual overlay.
- Responsive checks passed at 1440×1000, 1024×900, 768×900, and 390×844 with no horizontal overflow. The mobile navigation opened correctly and locked background scroll.
- `/create` at 390px rendered its form with `html[lang="ja"]`, a Japanese main landmark, no horizontal overflow, and no browser console warnings/errors.
