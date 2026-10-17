# STEM Industry Skills — SPC Practice Prototype

A five-minute educational web prototype for laboratory STEM PhD students practicing an SPC control-chart concept using fictional data.

## Milestone scope

This is the First Working Slice for a Current State of Generative AI semester project. Keep this milestone frontend-only, with prepared examples and deterministic branching. Do not add live AI, accounts, payments, a database, permanent learner profiles, job-board integration, instrument simulation, or a large course catalog. Do not publish yet.

The audience is final-year laboratory STEM PhD students transitioning into industry; avoid overstating their experience or suggesting certification or workplace competence. The title is descriptive and provisional, not an approved brand.

**Why:** the user deliberately scoped this milestone to one understandable five-minute learning flow, not a production learning platform.

See `README.md` for use, limitations, references, and observed test results. Keep it suitable for the user's existing public GitHub repository; do not create or replace a repository.

## Run & Operate

- Open the web preview at `/` and select **Load sample scenario**.
- Managed workflow: `artifacts/spc-learning-slice: web`.
- `pnpm --filter @workspace/spc-learning-slice typecheck` — app type check.
- `node --test artifacts/spc-learning-slice/tests/logic.test.mjs` — deterministic rule checks.
- No secrets, database, or backend are needed for this prototype.

## Stack

- pnpm workspaces, React, Vite, TypeScript; in-memory React state only.
- The starter API and database libraries are unused by this prototype.

## Where things live

- `artifacts/spc-learning-slice/` — educational app.
- `README.md` — product scope, use, limitations, references, and honest test record.

## Architecture decisions

Only the exact fictional scenario is supported; arbitrary text must receive an explicit unsupported-content message, not an implied AI analysis. Self-reported experience must not be silently overridden by diagnostic feedback.

## Product

Target scenario → confirm potential gap → diagnostic and introductory/challenge practice → review. Fictional data, supplied historical control limits, optional specification comparison, answer-specific feedback, retries and restart.

## User preferences

Keep repository documentation ready for the user's existing public GitHub repository: https://github.com/vadimtrepalin94-afk/genai_Project_Prototype . Do not infer pushed or published status from this link.

## Gotchas

Progress is intentionally not saved after reload. Do not add persistence to this milestone.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
