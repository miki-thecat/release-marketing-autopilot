<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ReleaseFlow repository guide

ReleaseFlow turns a browser recording and feature details into a release video plus English X and LinkedIn copy. The current product and technical boundaries are documented in [docs/PRODUCT.md](docs/PRODUCT.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/DESIGN.md](docs/DESIGN.md), and [docs/QUALITY.md](docs/QUALITY.md).

Before changing code, inspect the relevant route, component, library, test, and documentation. Keep work inside the requested scope; do not add product features, infrastructure, or broad refactors unless the task requires them. If a product decision is not documented, mark it `TODO` or ask for direction rather than inferring it.

For non-trivial work, create a short plan in `docs/exec-plans/active/` before implementation. Record the goal, scope, decisions, progress, and validation; move it to `docs/exec-plans/completed/` when finished. Trivial internal edits do not need a repository plan.

Validate relevant changes with `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`; explain any command intentionally not run. Prefer an existing applicable skill when it clearly fits, but do not add repository-local skills until a concrete, repeated workflow justifies one.
