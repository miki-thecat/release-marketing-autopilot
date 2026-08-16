<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ReleaseFlow repository guide

ReleaseFlow turns a browser recording and feature details into a release video and English social copy. Start with [docs/PRODUCT.md](docs/PRODUCT.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/DESIGN.md](docs/DESIGN.md), [docs/ENGINEERING.md](docs/ENGINEERING.md), [docs/QUALITY.md](docs/QUALITY.md), and [docs/exec-plans/](docs/exec-plans/).

Inspect the relevant implementation, tests, and docs before coding. Preserve existing behavior unless the task explicitly changes it. Do not invent undocumented product requirements: when an ambiguity does not block safe work, preserve the behavior and record it; escalate only when a product decision is required to complete the task safely.

Keep changes within scope and follow the reuse-first guidance in `docs/ENGINEERING.md`. If product requirements, architecture, a major dependency/foundation, or the implementation strategy changes materially, update the active Issue and relevant source-of-truth docs before continuing implementation. If a task explicitly adopts an external library/template and its official distribution path is available, use the actual dependency/source rather than silently hand-writing an imitation; report a blocker instead of changing the agreed strategy without notice.

Use tests and runtime evidence over assumptions. Use a short execution plan in `docs/exec-plans/active/` only for genuinely non-trivial work, then move it to `completed/` with the result.

Run `npm run verify` before handoff, explaining any omission. Do not force subagents, skills, or broad refactors for ordinary tasks; add repository-local skills only for a proven, repeated ReleaseFlow-specific workflow.
