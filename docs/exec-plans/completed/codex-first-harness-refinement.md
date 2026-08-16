# Codex-first harness refinement

## Goal

Refine the repository development workflow without changing ReleaseFlow product behavior.

## Scope

- Keep the Next.js-managed agent block and shorten the repository guidance to a durable map.
- Add a unified local verification script and minimal GitHub issue/PR templates.
- Remove the redundant Claude compatibility file when the installed Next.js generator does not require it.

## Decisions

- The later Harness v1 migration adds only the project-scoped Next.js DevTools MCP configuration required for runtime inspection.
- Do not add skills, hooks, a custom worktree manager, `.worktreeinclude`, or Playwright.

## Result

- [x] Inspected Next.js, Codex configuration, CI, docs, and current files.
- [x] Applied the minimal workflow changes.
- [x] Passed `npm run verify` at committed SHA `a06e7be` (lint, typecheck, 7 test files / 15 tests, and production build).

## Notes

The test environment emitted non-fatal local Fontconfig cache warnings. Next.js DevTools MCP runtime verification is recorded with the Harness v1 migration rather than attributed to this earlier commit.
