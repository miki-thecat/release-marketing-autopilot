# Agent-first development harness

## Goal

Add concise repository guidance and factual documentation so ChatGPT and Codex can plan, implement, and verify changes consistently.

## Scope

- Extend the root agent instructions without modifying the generated Next.js rules block.
- Document the current product, architecture, design, quality process, and execution-plan convention.
- Inspect existing CI; do not add another workflow.

## Decisions

- Do not add a repository-local Codex skill now: no concrete repeated workflow warrants its maintenance cost.
- Keep unknown future product and production-architecture choices as `TODO`.

## Result

- [x] Inspected the current repository, tests, scripts, and CI.
- [x] Added the requested guidance and documentation.
- [x] Passed `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.

## Notes

The integration tests emitted non-fatal local Fontconfig cache warnings. No product behavior, CI workflow, or repository-local skill was added.
