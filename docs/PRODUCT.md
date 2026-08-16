# Product

## Purpose

ReleaseFlow helps a SaaS or developer-tool team finish a release announcement after shipping a feature. A user supplies a browser recording and brief feature details; the Local Core MVP produces a Release Pack:

- A 1080p H.264 release video
- English X post
- English LinkedIn post

## Current workflow

1. Create a release with feature name, description, optional product URL, and an MP4 or MOV browser recording.
2. Validate and analyze the recording, plan a storyboard, then render the video.
3. Preview or download the video, copy the social posts, and optionally regenerate with a focused instruction.

## Boundaries

- The UI supports Japanese and English; Japanese is the current development default.
- Generated release copy is English-first.
- The Local Core MVP has no authentication, billing, database, durable queue, or social posting integration.
- Voiceover, music, advanced timeline editing, and broad localization are out of scope.

## Current product strategy

The initial target is founder-led small B2B SaaS and DevTool teams. ReleaseFlow's core job is to finish release-announcement work after a feature ships: turn a rough browser recording and short feature description into a usable release video and English social copy in minutes.

The current monetization hypothesis is a paid SaaS at approximately USD 29/month. The commercial number and target details are hypotheses to validate, not permanent product requirements. Validation focuses on a real recording being supplied, output actually being posted, a user paying, and repeat use on a later release.

For MVP decisions, prioritize paying-user validation, time-to-value, output quality, repeat usage, and distribution before engineering sophistication. Avoid premature infrastructure or generalized editing features unless they materially improve validation or the release-announcement job.

## Open product decisions

- TODO: Define the requirements and priority for optional Japanese release-copy output.
- TODO: Define the product requirements for global validation and the English UI default.
