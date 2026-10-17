# STEM Industry Skills — SPC Practice Prototype

A five-minute educational web prototype helping final-year laboratory STEM PhD students practice an introductory statistical process control concept using fictional semiconductor measurements.

**Working title only.** Created for the *Current State of Generative AI* semester project, **First Working Slice**. Not a certification or an assessment of workplace competence.

Repository: https://github.com/vadimtrepalin94-afk/genai_Project_Prototype . This documentation update does not verify or assert current pushed or published status.

## Open and use

Open the web preview in Replit. Select **Load sample scenario**, continue through the four steps, confirm your SPC experience, answer the diagnostic, and choose introductory or challenge practice. Review your feedback, retry, try the other activity, or restart.

Only the supplied fictional job description and learner summary are supported. Changed text receives an explicit limitation message with sample restoration; empty fields receive inline guidance. Inputs stay in browser memory and are not sent to a service. Reloading clears progress.

For developers: run `pnpm install` once, then use the configured `artifacts/spc-learning-slice: web` workflow. Outside the managed preview, run `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/spc-learning-slice dev` and open the displayed local address. Check types with `pnpm --filter @workspace/spc-learning-slice typecheck`.

## Functional versus simulated

- **Functional:** four-step navigation, input validation, experience correction, diagnostic, explicit route choice, chart and data table, introductory and challenge activities, answer-specific feedback, retries, review, and restart.
- **Simulated:** gap analysis and feedback use prepared content and deterministic rules. No model interprets arbitrary job descriptions or backgrounds. Future AI could interpret varied descriptions and provide contextual feedback; this version does not.
- **No added services:** no live AI, accounts, payments, database, job board, instrument simulation, or permanent learner profile.

## Known Limitations

1. **Prepared inputs / simulated AI:** only the supplied fictional scenario is supported; no semantic AI analysis.
2. **One educational topic / no practical certification:** only a displayed SPC beyond-limit rule and its distinction from specifications are practiced. This does not establish process stability, diagnose a fault, certify skills, or demonstrate manufacturing competence.
3. **No saved progress:** everything is held in memory and cleared after reload or restart.

## Educational data and references

Fictional film thickness readings (nm), observations 1–8: **100, 101, 99, 100, 102, 101, 105, 100**.

Supplied historical center line: **100 nm**; lower / upper control limits: **97 / 103 nm**. These illustrative limits come from a fictional prior baseline, not the eight readings. Challenge specification bounds are **94 / 106 nm**, representing fictional engineering requirements rather than process behavior.

Explanations are original concise teaching text. Background reading:

- [NIST: Process control](https://itl.nist.gov/div898/handbook/pmc/section1/pmc14.htm)
- [NIST: Control charts](https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc31.htm)

## Test Results

### User-reported manual tests

The user reported completing these manual tests on **October 16–17, 2026 (America/New_York)**. Replit Agent documented the results but did **not** independently perform these manual tests. Results below reflect only the actions and outcomes the user reported.

| Test | Input or action | What happened | Pass, partial, or fail |
| --- | --- | --- | --- |
| Typical case: introductory flow, incorrect-answer recovery, and restart | Complete the introductory flow and all four questions; deliberately select an incorrect answer, retry and correct it; select Restart | The user completed the flow and all four questions. The incorrect answer produced incorrect-answer feedback and a retry, and the user corrected it successfully. No crash occurred. Restart cleared all inputs and started over. | Pass |
| Challenge case: existing SPC experience | Select existing SPC experience and use the harder exercise | The user reported that the app adjusted the experience level and provided a harder exercise, and reported “Test 2 passed.” | Pass |
| Invalid/empty case: both fields empty | Submit with both fields empty, then fill them | The user reported a warning that both fields were empty and could continue by filling them. Exact warning text was not recorded. This does not establish that a complete post-validation learning flow was retested. | Pass |

### Previously recorded automated checks

These checks were executed during the initial build and recorded on **2026-10-17**. They were **not rerun** for this documentation-only update. They test deterministic rules and types, not complete browser interactions.

| Test | Input or action | What happened | Pass, partial, or fail |
| --- | --- | --- | --- |
| Beginner route rules | Sample validation, beginner initial route, introductory recommendation, correct point and next-action answers | Deterministic rule checks passed; no automated browser completion through review was run. | Pass |
| Challenge route rules | Experienced initial route, correct diagnostic, challenge answer; wrong diagnostic also checked | Experience selects challenge; diagnostic recommendation is separately calculated; correct challenge answer accepted. | Pass |
| Empty-field validation rules | Empty/whitespace fields, one empty field, then valid sample | Field-specific recovery messages returned; valid sample accepted. | Pass |
| Unsupported input | Change either sample; also try harmless outer whitespace | Changed content rejected as unsupported; trimmed sample accepted. | Pass |
| Educational data and rule | Compare supplied readings, limits, specification bounds, beyond-limit result | Exact values match; only observation 7 signals; 105 nm remains inside specifications; points exactly on limits do not signal. | Pass |
| Prepared feedback | Evaluate all question options and diagnostic branches | Each question has one correct answer and distinct feedback for every option; diagnostic branches match requirements. | Pass |
| Automated logic suite | `node --test artifacts/spc-learning-slice/tests/logic.test.mjs` (Node 24) | 7 tests passed, 0 failed. These are rule checks, not end-to-end browser tests. | Pass |
| TypeScript check | `pnpm --filter @workspace/spc-learning-slice typecheck` | Exited successfully with no TypeScript errors. | Pass |

### Previously recorded Agent preview inspection and remaining coverage

| Test | Input or action | What happened | Pass, partial, or fail |
| --- | --- | --- | --- |
| Initial desktop preview | Open root page during the initial build | Replit Agent observed Step 1, progress, disclosure, sample button and labeled textareas rendered. An initial missing-icon 404 was observed; an embedded favicon was subsequently added. | Pass |
| Additional browser coverage | Back-navigation, unsupported-skill recovery, reload clearing, and mobile walkthrough | **Not run** by Replit Agent and not covered by the supplied user-reported results. Practice-chart rendering was not separately verified or specifically reported. | Not run |

No automated end-to-end suite or code review was run for the first build. The user-reported manual results above add coverage for the reported introductory flow, incorrect-answer feedback and retry, restart, harder exercise, and empty-field recovery; they do not imply that every route or edge case has been independently verified.
