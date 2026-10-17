# STEM Industry Skills — SPC Practice Prototype

A five-minute educational web prototype helping final-year laboratory STEM PhD students practice an introductory statistical process control concept using fictional semiconductor measurements.

**Working title only.** Created for the *Current State of Generative AI* semester project, **First Working Slice**. Not a certification or an assessment of workplace competence.

## Open and use

Open the web preview in Replit. Select **Load sample scenario**, continue through the four steps, confirm your SPC experience, answer the diagnostic, and choose introductory or challenge practice. Review your feedback, retry, try the other activity, or restart.

Only the supplied fictional job description and learner summary are supported. Changed text receives an explicit limitation message with sample restoration; empty fields receive inline guidance. Inputs stay in browser memory and are not sent to a service. Reloading clears progress.

For developers: run `pnpm install` once, then use the configured `artifacts/spc-learning-slice: web` workflow. Outside the managed preview, run `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/spc-learning-slice dev` and open the displayed local address. Check types with `pnpm --filter @workspace/spc-learning-slice typecheck`.

## Functional versus simulated

- **Functional:** four-step navigation, input validation, experience correction, diagnostic, explicit route choice, chart and data table, introductory and challenge activities, answer-specific feedback, retries, review, and restart.
- **Simulated:** gap analysis and feedback use prepared content and deterministic rules. No model interprets arbitrary job descriptions or backgrounds. Future AI could interpret varied descriptions and provide contextual feedback; this version does not.
- **No added services:** no live AI, accounts, payments, database, job board, instrument simulation, or permanent learner profile. Not published. No GitHub repository has been created or replaced; these files can be added to the user's existing public repository when its link is supplied.

## Three limitations

1. **Prepared inputs / simulated AI:** only the supplied fictional scenario is supported; no semantic AI analysis.
2. **One educational topic / no practical certification:** only a displayed SPC beyond-limit rule and its distinction from specifications are practiced. This does not establish process stability, diagnose a fault, certify skills, or demonstrate manufacturing competence.
3. **No saved progress:** everything is held in memory and cleared after reload or restart.

## Educational data and references

Fictional film thickness readings (nm), observations 1–8: **100, 101, 99, 100, 102, 101, 105, 100**.

Supplied historical center line: **100 nm**; lower / upper control limits: **97 / 103 nm**. These illustrative limits come from a fictional prior baseline, not the eight readings. Challenge specification bounds are **94 / 106 nm**, representing fictional engineering requirements rather than process behavior.

Explanations are original concise teaching text. Background reading:

- [NIST: Process control](https://itl.nist.gov/div898/handbook/pmc/section1/pmc14.htm)
- [NIST: Control charts](https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc31.htm)

## Test record

Only observed checks are recorded as passed. Logic checks do not substitute for a browser walkthrough. Unexecuted cases are explicitly marked **Not run**.

| Test | Input or action | What happened | Pass/partial/fail |
| --- | --- | --- | --- |
| Typical sample beginner completes practice | Sample validation, beginner initial route, introductory recommendation, correct point and next-action answers | Deterministic rule checks passed. Full browser completion through review: **Not run**. | Partial |
| Challenge user corrects SPC experience and uses harder route | Experienced initial route, correct diagnostic, challenge answer; wrong diagnostic also checked | Experience selects challenge; diagnostic recommendation is separately calculated; correct challenge answer accepted. Browser correction/navigation: **Not run**. | Partial |
| Invalid empty fields get helpful recovery | Empty/whitespace fields, one empty field, then valid sample | Field-specific messages offer sample loading; valid sample accepted. Browser retention/restoration interaction: **Not run**. | Partial |
| Unsupported input | Change either sample; also try harmless outer whitespace | Changed content rejected as unsupported; trimmed sample accepted. | Pass |
| Educational data and rule | Compare supplied readings, limits, specification bounds, beyond-limit result | Exact values match; only observation 7 signals; 105 nm remains inside specifications; points exactly on limits do not signal. | Pass |
| Prepared feedback | Evaluate all question options and diagnostic branches | Each question has one correct answer and distinct feedback for every option; diagnostic branches match requirements. | Pass |
| Automated logic suite | `node --test artifacts/spc-learning-slice/tests/logic.test.mjs` (Node 24) | 7 tests passed, 0 failed. These are rule checks, not end-to-end browser tests. | Pass |
| TypeScript check | `pnpm --filter @workspace/spc-learning-slice typecheck` | Exited successfully with no TypeScript errors. | Pass |
| Initial preview | Open root page in desktop preview | Step 1, progress, disclosure, sample button and labeled textareas rendered. An initial missing-icon 404 was observed; an embedded favicon was subsequently added. Interactive steps and mobile walkthrough: **Not run**. | Pass |

Checks recorded on 2026-10-17. No end-to-end suite or code review was run for this first build. Restart, back-navigation, retry, unsupported-skill recovery, chart rendering during practice, and reload clearing have **not** been exercised interactively in a browser.
