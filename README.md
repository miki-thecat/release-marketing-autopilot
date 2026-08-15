# ReleaseFlow

ReleaseFlow finishes the announcement after a SaaS team ships a feature. Give it a rough browser recording and a short feature description; it produces an AI-directed release video, an English X post, and an English LinkedIn post as one Release Pack.

This repository is the Local Core MVP: a local Next.js application with server-side AI planning, deterministic FFmpeg rendering, and filesystem storage. It intentionally has no authentication, billing, database, queue, or social posting integrations.

## What works

- Streamed MP4/MOV upload with file-size, MIME, FFprobe container, duration, and resolution validation
- Sparse local frame extraction with uniform coverage, scene-change candidates, timestamps, resizing, and caching
- One multimodal OpenAI Responses API call for storyboard, hook, CTA, captions, focus hints, and English social copy
- Zod Structured Outputs plus a second source-aware validation and clamping boundary
- Deterministic fallback planning when no API key is configured or OpenAI fails
- Storyboard-driven 1080p H.264 rendering with 1–4 selected source segments
- Subtle per-scene focus/zoom, generated captions, intro hook, and CTA outro
- Real preview, MP4 download, copy buttons, and high-level Regenerate controls
- Japanese and English UI dictionaries; Japanese is the development default
- Structured per-release analytics and AI usage/cost-observability logs

## Requirements

- Node.js 22 or newer
- npm
- FFmpeg and FFprobe available on `PATH`

Verify the media tools:

```bash
ffmpeg -version
ffprobe -version
```

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

On PowerShell:

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), upload a real MP4/MOV browser recording, describe the shipped feature, and choose **Release Packを生成**.

### Environment variables

```dotenv
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5.4-mini

RELEASEFLOW_DATA_DIR=
FFMPEG_PATH=ffmpeg
FFPROBE_PATH=ffprobe
NEXT_PUBLIC_DEFAULT_LOCALE=ja
```

`OPENAI_API_KEY` is server-only and must not use a `NEXT_PUBLIC_` prefix. `OPENAI_MODEL` is optional; the default is centralized in `src/lib/config.ts`, so changing models does not touch planning business logic.

If `OPENAI_API_KEY` is absent, the app remains fully usable with the deterministic local planner. If OpenAI times out, is rate limited, returns invalid structured output, or is unavailable, the current job logs a safe provider failure and automatically retries planning with that fallback. The deterministic provider cannot reliably translate arbitrary Japanese descriptions; use OpenAI for English-first external validation.

Japanese is the initial development UI. Change `NEXT_PUBLIC_DEFAULT_LOCALE` to `en` before global validation. All component-facing UI strings come from `src/locales/ja.ts` and `src/locales/en.ts`.

## Processing flow

1. The API streams the upload to a UUID-scoped local release directory.
2. FFprobe validates the actual media and records duration, resolution, codec, and container.
3. FFmpeg samples representative JPEGs. A typical 30–60 second input uses about 12–16 frames; all inputs are capped at 20. Frames are 800 px wide or smaller and keep source timestamps.
4. When configured, OpenAI receives the feature details, duration, timestamp labels, and only those compressed frames. It returns one structured release plan.
5. Zod checks the response shape. Source-aware validation then clamps timestamps, reverses safe reversed ranges, drops unusable ranges, limits scenes to four, caps selected footage and output duration, bounds focus/zoom, and truncates text.
6. FFmpeg follows the validated storyboard: hook intro, selected source segments with restrained focus/zoom and captions, and CTA outro.
7. The UI serves the completed MP4 and the English X/LinkedIn copy.

Regenerate sends the current validated storyboard plus one instruction—shorter, more energetic, focus on results, less text, more professional, or custom—back through planning and rendering. It reuses the cached representative frames and never reuploads the source.

## Architecture

- `src/app`: Next.js page and Node.js Route Handlers
- `src/components`: localized release creation, processing, result, and Regenerate UI
- `src/lib/ai`: provider contract, OpenAI/Zod implementation, deterministic fallback, and usage logs
- `src/lib/video`: FFprobe, bounded frame extraction, assets, and storyboard-driven FFmpeg rendering
- `src/lib/jobs`: in-process orchestration and fallback handling
- `src/lib/storage`: safe UUID-scoped local storage
- `src/lib/release`: domain types, request validation, and renderer guardrails
- `src/locales`: typed Japanese and English UI dictionaries

Generated data is stored under `data/releases/<release-uuid>/` by default:

- `input.media`: immutable uploaded recording
- `frames/`: cached representative JPEGs and `manifest.json`
- `status.json`: release state, validated storyboard, copy, and planning metadata
- `output.mp4`: latest release video

Set `RELEASEFLOW_DATA_DIR` to use another location.

## AI cost control and observability

FFprobe, scene detection, frame sampling, resizing, validation, file operations, compositing, and encoding remain local and deterministic. Planning normally uses one AI request, with a bounded maximum of 20 low-detail images. Regenerate uses one additional request and reuses the frame cache.

Server logs include provider, model, operation, frame count, input/output tokens when the API supplies them, request duration, and regeneration count. Approximate cost is logged only for the zero-cost deterministic provider; the app does not invent a dollar estimate when current model pricing is unavailable.

## Quality commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Tests do not require a real API key. They cover storyboard guardrails, deterministic planning/regeneration, mocked OpenAI structured parsing, representative frame extraction/cache reuse, multi-segment FFmpeg output, safe storage paths, and the upload-to-release integration path.

## Continuous integration

GitHub Actions runs the same verification automatically for every push to `main`, every pull request targeting `main`, and manual `workflow_dispatch` runs. CI uses Ubuntu and Node.js 22, installs and verifies FFmpeg/FFprobe, then runs `npm ci`, lint, typecheck, the complete test suite (including real FFmpeg integration tests), and the production build. Normal CI uses the deterministic/mocked AI providers and does not require `OPENAI_API_KEY`.

## Docker

```bash
docker build -t releaseflow .
docker run --rm -p 3000:3000 \
  -e OPENAI_API_KEY="$OPENAI_API_KEY" \
  -e OPENAI_MODEL="${OPENAI_MODEL:-gpt-5.4-mini}" \
  -v releaseflow-data:/data/releases \
  releaseflow
```

The image installs FFmpeg and Noto fonts. Build-time public environment variables, such as `NEXT_PUBLIC_DEFAULT_LOCALE`, should be supplied when building if changing the UI default.

## Security and limits

- MP4/MOV only; maximum 500 MB and 90 seconds
- Resolution range: 320×180 through 7680×4320
- Upload body is streamed and guarded while writing; it is not buffered into memory
- Original filename is sanitized and display-only; fixed internal names and validated UUIDs prevent path traversal
- FFmpeg/FFprobe use argument arrays with `shell: false`
- API credentials remain server-side and are never included in logs or release records
- AI image count, dimensions, text, scenes, duration, timestamps, focus, and zoom are bounded
- Temporary render assets are removed in `finally`

## Known limitations

- Jobs run inside the local Next.js process and do not resume automatically after a restart
- Files have no retention policy; local storage can grow until manually managed
- Representative images do not include cursor/click metadata, so focus hints are semantic rather than pixel-perfect
- Scene selection quality depends on the visibility of the feature in the sampled frames and the configured model
- Rendering is silent and uses simple cuts; voiceover, music, a timeline, and advanced transition editing are intentionally out of scope
- The deterministic fallback chooses sensible temporal regions but cannot semantically inspect images or guarantee English translation from non-English input
- Local MVP concurrency and storage are not intended as production worker infrastructure
