# Quality

## Local verification

Run `npm run verify` before handing off a change unless it is not relevant, unavailable, or unsafe; explain any omission. It runs the complete local sequence:

```bash
npm run verify
```

The component checks remain available for focused diagnosis and are deliberately separate in GitHub Actions:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The Vitest suite includes validation, deterministic and mocked OpenAI planning, safe storage paths, frame extraction/cache reuse, FFmpeg rendering, and an upload-to-release integration path. FFmpeg and FFprobe must be available for media integration tests and production builds.

## Continuous integration

`.github/workflows/ci.yml` runs on pushes to `main`, pull requests targeting `main`, and manual dispatch. It installs Node.js 22, dependencies, FFmpeg, and Noto fonts; verifies FFmpeg/FFprobe; then runs lint, typecheck, tests, and the production build. It uses deterministic or mocked AI providers and does not require `OPENAI_API_KEY`.

Codex-managed worktrees can run `npm ci`, `npm run dev`, and `npm run verify` without copied API keys because the application and CI have deterministic or mocked fallbacks.

## Issue-driven development

The normal workflow is: create a scoped GitHub Issue; start a fresh Codex chat and worktree for that Issue; implement only its scope; use targeted checks while iterating; run `npm run verify`; push or open a PR that links and closes the Issue; wait for GitHub Actions; obtain independent review; fix findings on the same branch; then squash merge.

For runtime diagnostics, the project-scoped `next-devtools` MCP server is configured in `.codex/config.toml`. Start `npm run dev`, then confirm the coding agent has loaded `next-devtools`; it automatically discovers the running Next.js 16+ app and can inspect routes, logs, and compilation issues. If it is not available, restart the agent after confirming the config and running dev server.

## Browser validation

Playwright and browser E2E coverage are not installed. When a change affects the user workflow, manually verify the affected path where practical. Future E2E candidates are:

- Upload a valid recording and see progress complete.
- Preview and download the generated video and copy both posts.
- Regenerate a completed release and receive an updated result.
- See useful errors for invalid media and failed jobs.

## Definition of done

- The implementation and docs match the requested scope.
- Relevant tests and checks pass, or exceptions are recorded.
- No credentials, generated release data, or unrelated changes are included.
- Any undecided product behavior remains marked `TODO` rather than guessed.
