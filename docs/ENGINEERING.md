# Engineering

## Core principle: Adopt → Adapt → Build

Prefer the lowest-complexity solution that satisfies the requirement.

Before custom-building commodity functionality, inspect the relevant:

1. platform or standard capability
2. existing ReleaseFlow capability or abstraction
3. suitable maintained external solution, including open source or a commercial component/service

Reuse when it reduces total complexity. Implement locally when an external dependency would add more opacity, coupling, maintenance burden, or risk than the functionality itself. Reuse-first is not dependency-first.

Custom work is also justified when it is part of ReleaseFlow's product differentiation or when existing options do not meet the requirements.

## Minimum necessary complete change

Implement the smallest complete change that satisfies the active acceptance criteria and preserves all required correctness, tests, reliability, security, accessibility, migrations, documentation, and cleanup.

Do not add speculative product features, abstractions or generalized frameworks, compatibility layers, fallback paths, dependencies, infrastructure, unrelated refactors, or polish for hypothetical future requirements.

If useful adjacent work is discovered but is not required now, record it as a follow-up instead of expanding the current scope. When replacing an implementation, remove the obsolete path instead of keeping parallel implementations "just in case" unless compatibility or rollback is an explicit requirement.

## Explicit external adoption

When an Issue explicitly names a library, template, component system, or OSS foundation to adopt, treat the adoption method as part of the implementation contract.

- Use the project's official install/distribution mechanism when one exists.
- Reuse the actual source/package/component rather than silently hand-writing an imitation.
- Record the source and the concrete adoption evidence when the method matters, such as package/registry name, install command, generated/imported files, or license/provenance.
- If clean adoption is blocked, stop and report the blocker and alternatives. Do not silently substitute a custom implementation that changes the agreed strategy.

## Context authority

Treat the active Issue and repository sources of truth as the durable task contract. Prior chats, closed Issues, old PR descriptions, and superseded plans are historical context, not current authority.

If authoritative sources conflict, do not silently choose one. Determine whether the newer decision intentionally supersedes the old one, update the affected source of truth when appropriate, or stop and report the conflict before implementation.

## Context sync before strategy changes

Before continuing implementation after a material change, update the active Issue and any repository source of truth that would otherwise become materially false or misleading.

Treat a change as material when it changes one or more of:

- externally observable product behavior or acceptance criteria
- an architecture boundary, data model, or API contract
- a security, privacy, or reliability invariant
- a foundational library, framework, design system, infrastructure choice, or other major dependency/foundation
- an implementation method that is itself part of the task contract

Update only the sources of truth affected by the change:

- `docs/PRODUCT.md` for user/job/output/product-scope changes
- `docs/ARCHITECTURE.md` for runtime, dependency, data-flow, or boundary changes
- `docs/DESIGN.md` for visual/interaction foundations and durable design decisions
- `docs/QUALITY.md` or this file for workflow, validation, or engineering-policy changes

A rename, typo, local refactor, implementation detail, or ordinary bug fix that preserves the existing contract does not require a context-sync ceremony.

## Issue, branch, and chat lifecycle

A non-trivial Issue normally owns one branch/worktree/PR through completion. Agent sessions are execution context, not durable memory.

Keep the same coding-agent chat for ordinary fixes when the current context remains useful. Prefer a fresh coding-agent chat when prior conversational context is likely to bias work toward a superseded strategy. A fresh agent must be able to recover the task from the active Issue, repository docs, git history, and PR discussion without relying on previous chat memory.

## Method-sensitive agent contracts

When *how* the work is implemented matters, make that requirement verifiable in the Issue. Include only the fields that are relevant:

- source of truth / reuse decision
- must preserve / must change / must not do
- acceptance criteria
- required evidence
- stop conditions

A requirement such as "use Tailark" is weaker than evidence such as "the official registry is configured, the exact registry items are installed, and the page composes the installed source." Prefer verifiable evidence when the distinction is load-bearing.

Use binary evidence for method, provenance, and other objectively testable requirements. Do not force subjective product or visual quality into artificial yes/no checks; evaluate those qualitatively in the appropriate review gate.

## Harness feedback

When an agent failure is found, classify it before adding more rules:

- **task-specific:** the Issue, prompt, or implementation was wrong for this task; fix it and move on
- **systemic:** a durable harness/repository gap is likely to cause meaningful recurrence; make the smallest reusable change that would prevent or expose it earlier
- **transient/external:** a temporary tool, service, package registry, flaky test, model, or environment failure; do not turn it into permanent policy without evidence of recurrence

For a failure-driven harness change, sanity-check at least two cases:

1. the original failure should now be prevented or exposed earlier
2. an ordinary task should remain simple and unobstructed

Add orchestration, agents, MCPs, formal evals, mechanical checks, tests, or policy layers only when repeated or high-cost failures demonstrate that they are needed.
