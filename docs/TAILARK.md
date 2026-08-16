# Tailark OSS provenance

ReleaseFlow Web v2 adopts Tailark OSS Dusk through the public shadcn registry, not as a visual reference.

## Registry and install record

- Registry: `@tailark-oss` → `https://oss.tailark.com/r/{name}.json` in `components.json` (Base UI).
- Official commands run from the repository root:

  ```bash
  npx shadcn@latest search @tailark-oss -q dusk -l 100 --json
  npx shadcn@latest view @tailark-oss/dusk-landing-2
  npx shadcn@latest add @tailark-oss/dusk-landing-2 @tailark-oss/dusk-features-5 --yes --overwrite
  ```

- Selected registry items: `dusk-landing-2` (page scaffold, including Hero 2, Features 3/4, FAQs 1, CTA 2, Footer 2) and `dusk-features-5` (product walkthrough).

## Adapted source

The installed Tailark Dusk source is retained and adapted in `src/components/hero-section-2*.tsx`, `features-3.tsx`, `content-2.tsx`, `features-4.tsx`, `features-5.tsx`, `faqs-1.tsx`, `call-to-action-2.tsx`, `footer-2.tsx`, and `ui/`. `src/app/page.tsx` composes these sources directly.

Unsupported scaffold sections (statistics, pricing, logo-cloud assets) were removed rather than shown with fictional claims.

## ReleaseFlow-specific areas

- `src/components/marketing/product-entry-adapter.tsx` provides the small homepage → `/create` boundary.
- `src/content/marketing.ts` owns provisional product copy and internal-demo data.
- The proof and workflow surfaces use ReleaseFlow’s real input/output model, with no customer claims.

Tailark’s public `tailark/blocks` repository states that Tailark is released under the MIT License: <https://github.com/tailark/blocks/blob/main/LICENCE.md>.
