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

The normal workflow is:

1. create a scoped GitHub Issue with verifiable acceptance criteria
2. sync the Issue and relevant source-of-truth docs first if the product, architecture, major foundation/dependency, or implementation strategy has materially changed
3. start a fresh coding-agent chat and worktree for the new non-trivial Issue
4. implement only the Issue scope, using targeted checks while iterating
5. run `npm run verify`
6. push/open a PR that links and closes the Issue
7. when implementation method or external-source provenance matters, review that contract/evidence before spending time on visual or runtime polish
8. wait for GitHub Actions and obtain independent review
9. verify runtime and product/visual quality where relevant
10. fix findings on the same branch/worktree/PR, then squash merge

Ordinary review fixes under the same implementation strategy normally stay in the same coding-agent chat. If the strategy itself materially resets, prefer a fresh coding-agent chat while keeping the same Issue/branch/worktree/PR when those still represent the same unit of work. The repository and PR discussion are the handoff, not the previous chat history.

Use the lightweight reuse/adoption and stop-condition rules in `docs/ENGINEERING.md`; do not turn ordinary changes into process-heavy exercises.

For runtime diagnostics, the project-scoped `next-devtools` MCP server is configured in `.codex/config.toml`. Start `npm run dev`, then confirm the coding agent has loaded `next-devtools`; it automatically discovers the running Next.js 16+ app and can inspect routes, logs, and compilation issues. If it is not available, restart the agent after confirming the config and running dev server.

## Review gates

Apply only the gates relevant to the change, in this order:

1. **Contract / provenance** — if the Issue requires a particular implementation method, dependency, template, or external source, confirm the required evidence exists and no silent substitute was used.
2. **Correctness** — lint, types, tests, build, CI, and focused code review.
3. **Runtime** — exercise the affected user/system path where practical.
4. **Product quality** — evaluate UX, visual quality, copy, or generated output when those are part of the task.

A green CI run cannot prove a method-sensitive requirement such as "use the official OSS source" or a subjective requirement such as visual quality; review those separately.

## Browser validation

Playwright and browser E2E coverage are not installed. When a change affects the user workflow, manually verify the affected path where practical. Future E2E candidates are:

- Upload a valid recording and see progress complete.
- Preview and download the generated video and copy both posts.
- Regenerate a completed release and receive an updated result.
- See useful errors for invalid media and failed jobs.

## Definition of done

- The implementation and docs match the requested scope and current strategy.
- Method-sensitive acceptance criteria and required provenance/evidence are satisfied when relevant.
- Relevant tests and checks pass, or exceptions are recorded.
- Runtime/product evidence is included when the change needs it.
- No credentials, generated release data, or unrelated changes are included.
- Any undecided product behavior remains marked `TODO` rather than guessed.
