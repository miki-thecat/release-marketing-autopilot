# Codex-first harness refinement

## Goal

Refine the repository development workflow without changing ReleaseFlow product behavior.

## Scope

- Keep the Next.js-managed agent block and shorten the repository guidance to a durable map.
- Add a unified local verification script and minimal GitHub issue/PR templates.
- Remove the redundant Claude compatibility file when the installed Next.js generator does not require it.

## Decisions

- Do not add `.codex/config.toml`: the installed Codex CLI confirms global MCP syntax but does not establish project-scoped config discovery.
- Do not add skills, hooks, a custom worktree manager, `.worktreeinclude`, or Playwright.

## Result

- [x] Inspected Next.js, Codex configuration, CI, docs, and current files.
- [x] Applied the minimal workflow changes.
- [x] Passed `npm run verify` (lint, typecheck, 8 test files / 18 tests, and production build).

## Notes

Next.js DevTools MCP is supported by Next.js 16.3.1, but it was not configured or runtime-tested because project-scoped Codex configuration loading could not be verified from the installed Codex CLI. The test environment emitted non-fatal local Fontconfig cache warnings.
