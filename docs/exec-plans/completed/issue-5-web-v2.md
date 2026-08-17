# Issue #5 — adaptable Web v2

## Goal

Make `/` a polished ReleaseFlow marketing site while preserving the current working release generator at `/create`. Keep the site system durable and the current product story replaceable.

## Architecture

- Keep global shell, containers, typography, tokens, section patterns, proof surfaces, FAQ, CTA, footer, responsive behavior, and restrained motion in stable marketing components and styles.
- Keep hero promise, use cases, capability copy, FAQ answers, CTA labels, and internal demo metadata in one provisional content module.
- Put the marketing-to-product transition behind `ProductEntryAdapter`; it links to `/create` and does not duplicate upload or generation logic.
- Keep the marketing page server-rendered by default. Limit client code to the mobile dialog, demo tabs, and before/after switch.
- Keep the unchanged `ReleaseFlowApp` at `/create`; API routes and product domain modules remain untouched.

## Work completed

- [x] Added `/create` with route-specific metadata and replaced `/` with Web v2.
- [x] Built the full navigation-to-footer narrative with configurable provisional content.
- [x] Added accessible mobile navigation, proof gallery tabs, before/after control, FAQ, and product entry transitions.
- [x] Updated `docs/DESIGN.md` with stable/volatile boundaries and provisional areas.
- [x] Added focused tests for the marketing content boundary.
- [x] Ran targeted lint, typecheck, tests, and production build checks.
- [x] Inspected 1440×1000, 1024×900, 768×900, and 390×844 in-browser.

## Result

The homepage is now a complete adaptable marketing system with a near-black/off-white editorial rhythm and one ReleaseFlow accent. Product-dependent messaging and four clearly labeled internal demo examples are localized in `src/content/marketing.ts`; stable site composition lives in `src/components/marketing/`.

Browser validation covered the full scroll narrative, desktop and native-dialog mobile navigation, keyboard-operable gallery tabs, before/after switching, exclusive native FAQ disclosures, final CTA/footer, and marketing-to-`/create` navigation. The existing product was exercised at 390 px with a generated six-second MP4 and no `OPENAI_API_KEY`: upload, deterministic processing, result video, download action, and social-copy state all completed successfully.

The CSS-rendered internal demo media remains intentionally provisional and should be replaced with production demo assets when available; the gallery structure does not need to change.
