# Architecture

## Runtime and dependencies

- Next.js 16, React 19, TypeScript, and Node.js 22+
- FFmpeg and FFprobe for media analysis and rendering
- Sharp for image work
- OpenAI Responses API when `OPENAI_API_KEY` is configured; deterministic local planning as the fallback
- Zod for structured AI-output validation

## Request and job flow

1. The Next.js Route Handlers create a UUID-scoped local release and stream the uploaded media to disk.
2. `VideoJobRunner` probes the source, extracts or reuses representative frames, and asks the configured planner for a release storyboard.
3. The validated storyboard and social copy are stored with the release record.
4. The FFmpeg renderer creates the final video from selected source segments, captions, intro hook, and CTA outro.
5. The UI polls the release state and serves the generated video from the release API.

## Module map

- `src/app`: page, layout, and release Route Handlers
- `src/components`: release creation, progress, results, and regeneration UI
- `src/lib/ai`: provider contract, OpenAI provider, deterministic fallback, and usage logging
- `src/lib/jobs`: in-process orchestration and provider fallback
- `src/lib/release`: domain types, validation, and errors
- `src/lib/storage`: UUID-scoped filesystem storage and safe paths
- `src/lib/video`: probing, frame extraction, and FFmpeg rendering
- `src/locales`: typed Japanese and English UI dictionaries

## Local data

By default, release files are stored in `data/releases/<release-uuid>/`:

- `input.media`: original upload
- `frames/`: cached representative frames and manifest
- `status.json`: release state, storyboard, copy, and planning metadata
- `output.mp4`: latest rendered video

Jobs run in the local Next.js process and do not resume after a restart. Local filesystem storage has no retention policy. Production worker, persistence, and retention architecture are TODO.
