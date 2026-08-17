# Design

## Web v2 direction

The marketing site uses **actual Tailark OSS Dusk source** as the implementation foundation for commodity marketing structure. Tailark is not merely a visual reference.

The default adoption mode is the official Tailark OSS registry through the repository's shadcn registry configuration. Selected Dusk source should be installed through the official mechanism, then composed/adapted for ReleaseFlow. If a fork, vendored source, source snapshot, or local copy is materially better, that mode must be explicitly approved in Issue #5 and upstream provenance must remain traceable.

A hand-written lookalike does not satisfy the Web v2 design contract when Issue #5 requires Tailark adoption.

### Stable site layer

Keep these durable across likely product changes:

- Tailark-derived global navigation and responsive site shell where appropriate
- container/grid system and typography hierarchy
- spacing, radii, borders, cards, FAQ, CTA, footer, and responsive behavior derived from/adapted from installed Tailark source where applicable
- product proof/media presentation primitives for the ReleaseFlow workflow
- keyboard focus, route links, semantic landmarks, and reduced-motion behavior

Use Tailark for commodity structure when it fits. Concentrate custom design/engineering on ReleaseFlow-specific product entry, proof/output presentation, and genuine gaps that the adopted source does not cleanly cover.

### Provisional product layer

Current hero messaging, product promise, target audiences, capability wording, FAQ answers, CTA labels, and internal demo metadata live together in `src/content/marketing.ts`. They describe the current recording-to-Release-Pack workflow and can change without rebuilding the stable page system.

`ProductEntryAdapter` owns the homepage-to-product transition. It currently explains the browser-recording input and links to `/create`; it does not duplicate upload or generation logic. If ReleaseFlow adopts a different input model, this adapter and the provisional content module are the intended replacement points.

### Page architecture

1. Tailark-derived navigation and product-first hero
2. Product entry adapter
3. Internal Feature Launch, Product Launch, and Changelog proof examples
4. Before/after transformation
5. Three-step process
6. Tailark-derived product/capability walkthrough
7. Current use-case hypotheses
8. Tailark-derived FAQ
9. Tailark-derived final CTA
10. Tailark-derived footer

Do not add filler merely because it exists in an upstream template. Preserve only sections that answer a distinct ReleaseFlow user question.

The existing working product remains at `/create`. Keep the homepage server-rendered by default and limit client components to interactions that actually require client state.

### Tailark provenance and evidence

Issue #5 owns the implementation-method contract. The PR must make adoption observable:

- official Tailark registry configuration is present;
- exact Tailark/shadcn install commands and selected registry items/source are reported;
- adopted/upstream-derived source files are identifiable;
- marketing composition imports/adapts those sources rather than only recreating their appearance;
- license/provenance remains traceable;
- ReleaseFlow-specific custom areas are identified separately.

If the official Tailark distribution mechanism or relevant source has changed, verify it before implementation and sync Issue #5 / this design source of truth if the change is material. If clean adoption is blocked, stop rather than silently switching to a custom imitation.

## Product shape

The product is a focused release workflow rather than a generic video editor: create a release, watch processing progress, then use the completed Release Pack.

The generated video uses an opening hook, selected browser-recording segments with restrained focus or zoom and captions, and a CTA outro. Regeneration accepts a single focused instruction and reuses the existing upload and frame cache.

## Language

- UI messages live in `src/locales/ja.ts` and `src/locales/en.ts`.
- `NEXT_PUBLIC_DEFAULT_LOCALE` selects the default; the development fallback is Japanese.
- External release content is English-first.

## Design decisions still open

- TODO: Finalize ReleaseFlow-specific product proof assets and content once the current product strategy stabilizes.
- TODO: Define the interaction and content requirements for any future multilingual output.
