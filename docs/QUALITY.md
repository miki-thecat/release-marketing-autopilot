# Quality

## Required local checks

Run the following before handing off a change unless a command is not relevant, unavailable, or unsafe; explain any omission.

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The Vitest suite includes validation, deterministic and mocked OpenAI planning, safe storage paths, frame extraction/cache reuse, FFmpeg rendering, and an upload-to-release integration path. FFmpeg and FFprobe must be available for media integration tests and production builds.

## Continuous integration

`.github/workflows/ci.yml` runs on pushes to `main`, pull requests targeting `main`, and manual dispatch. It installs Node.js 22, dependencies, FFmpeg, and Noto fonts; verifies FFmpeg/FFprobe; then runs lint, typecheck, tests, and the production build. It uses deterministic or mocked AI providers and does not require `OPENAI_API_KEY`.

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
