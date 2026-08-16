# Engineering

## Core principle: Adopt → Adapt → Build

Do not custom-build commodity functionality by default. Prefer, in order:

1. platform or standard capability
2. an existing ReleaseFlow capability or abstraction
3. a trusted, maintained open-source library/component
4. an appropriate commercial component or service
5. custom implementation

Custom work is justified when it is part of ReleaseFlow's product differentiation, when existing options do not meet the requirements, or when adopting them would create more risk or complexity than they remove.

## Explicit external adoption

When an Issue explicitly names a library, template, component system, or OSS foundation to adopt, treat the adoption method as part of the implementation contract.

- Use the project's official install/distribution mechanism when one exists.
- Reuse the actual source/package/component rather than silently hand-writing an imitation.
- Record the source and the concrete adoption evidence when the method matters (for example package/registry name, install command, generated/imported files, or license/provenance).
- If clean adoption is blocked, stop and report the blocker and alternatives. Do not silently substitute a custom implementation that changes the agreed strategy.

## Context sync before strategy changes

The repository is the system of record. Before continuing implementation after a material change to product requirements, architecture, a major dependency/foundation, or the implementation strategy, update the active Issue and the relevant repository docs first.

Update only the sources of truth affected by the change:

- `docs/PRODUCT.md` for user/job/output/product-scope changes
- `docs/ARCHITECTURE.md` for runtime, dependency, data-flow, or boundary changes
- `docs/DESIGN.md` for visual/interaction foundations and durable design decisions
- `docs/QUALITY.md` or this file for workflow, validation, or engineering-policy changes

Do not create process documents merely to record every small decision. A local implementation detail or ordinary review fix does not require a context-sync ceremony.

## Issue, branch, and chat lifecycle

A non-trivial Issue normally owns one branch/worktree/PR through completion. The coding-agent chat has a shorter lifecycle: keep the same chat for ordinary fixes under the same strategy, but prefer a fresh coding-agent chat when the implementation strategy materially resets. Use the Issue, docs, git history, and PR discussion as the handoff artifact instead of relying on chat memory.

## Method-sensitive agent contracts

When *how* the work is implemented matters, make that requirement verifiable in the Issue. Include only the fields that are relevant:

- source of truth / reuse decision
- must preserve / must change / must not do
- acceptance criteria
- required evidence
- stop conditions

A requirement such as "use Tailark" is weaker than evidence such as "the official registry is configured, the exact registry items are installed, and the page composes the installed source." Prefer the latter when the distinction is load-bearing.

## Harness feedback

When an agent failure is found, classify it before adding more rules:

- **task-specific:** fix the Issue/prompt/code and move on
- **systemic:** make the smallest durable harness/doc/template change that would prevent or expose the same failure class next time

Do not add orchestration, agents, MCPs, tests, or policy layers unless a repeated or high-cost failure demonstrates that they are needed.
