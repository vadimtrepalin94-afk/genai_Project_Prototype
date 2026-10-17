import { useRef, useState } from "react";
import { Quiz, emptyQ, type QState } from "@/components/quiz";
import { SpcChart } from "@/components/spc-chart";
import {
  CHAL, DIAG, INTRO_ACT, INTRO_OBS, SAMPLE_JOB, SAMPLE_SKILLS, analyze, initialRoute, isCorrect, recommend,
  type Experience, type Question, type Route,
} from "@/lib/spc";

type Phase = "diagnostic" | Route;
type QS = Record<"diag" | "introObs" | "introAct" | "chal", QState>;
const freshQ = (): QS => ({ diag: emptyQ, introObs: emptyQ, introAct: emptyQ, chal: emptyQ });
const STEPS = ["Set a target", "Confirm gap", "Diagnose and practice", "Review"];
const routeName = (r: Route) => (r === "intro" ? "Introduction to control-chart signals" : "Challenge: control limits vs. specifications");

export function SpcSlice() {
  const [step, setStep] = useState(1);
  const [job, setJob] = useState("");
  const [skills, setSkills] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [skill, setSkill] = useState<"spc" | "automation">("spc");
  const [exp, setExp] = useState<Experience | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [phase, setPhase] = useState<Phase>("diagnostic");
  const [started, setStarted] = useState<Route[]>([]);
  const [qs, setQs] = useState<QS>(freshQ);
  const top = useRef<HTMLDivElement>(null);

  const result = analyze(job, skills);
  const go = (s: number) => { setStep(s); setTimeout(() => top.current?.focus(), 0); };
  const resetPractice = () => { setQs(freshQ()); setStarted([]); setPhase("diagnostic"); };
  const resetDownstream = () => { setExp(null); setRoute(null); setSkill("spc"); resetPractice(); };
  const restart = () => {
    setJob(""); setSkills(""); setSubmitted(false); resetDownstream(); setStep(1);
    setTimeout(() => top.current?.focus(), 0);
  };
  const patch = (k: keyof QS, v: Partial<QState>) => setQs((p) => ({ ...p, [k]: { ...p[k], ...v } }));
  const props = (q: Question, k: keyof QS, locked = false) => ({
    q, locked, state: qs[k],
    onSelect: (id: string) => patch(k, { selected: id }),
    onSubmit: () => patch(k, { submitted: true, attempts: qs[k].attempts + 1 }),
    onRetry: () => {
      if (k === "diag") { setQs({ ...freshQ(), diag: { ...emptyQ, attempts: qs.diag.attempts } }); setStarted([]); }
      else if (k === "introObs") setQs((p) => ({ ...p, introObs: { ...emptyQ, attempts: p.introObs.attempts }, introAct: emptyQ }));
      else patch(k, { selected: null, submitted: false });
    },
  });
  const editInputs = (set: (v: string) => void) => (v: string) => { set(v); if (step === 1) { resetDownstream(); } };

  const diagDone = qs.diag.submitted;
  const rec = diagDone ? recommend(qs.diag.selected) : null;
  const unsupported = submitted && result.status === "unsupported";
  const inv = submitted && result.status === "invalid" ? result : null;

  const startRoute = (r: Route) => {
    setRoute(r); setPhase(r);
    setStarted((s) => (s.includes(r) ? s : [...s, r]));
    setTimeout(() => top.current?.focus(), 0);
  };
  const openPractice = (r: Route, reset: (keyof QS)[]) => {
    setQs((p) => { const n = { ...p }; reset.forEach((k) => (n[k] = { ...emptyQ, attempts: p[k].attempts })); return n; });
    setStarted((s) => (s.includes(r) ? s : [...s, r]));
    setRoute(r); setPhase(r); go(3);
  };

  const introObsOk = isCorrect(INTRO_OBS, qs.introObs.selected) && qs.introObs.submitted;
  const introActOk = isCorrect(INTRO_ACT, qs.introAct.selected) && qs.introAct.submitted;
  const chalOk = isCorrect(CHAL, qs.chal.selected) && qs.chal.submitted;
  const introTried = qs.introObs.submitted || qs.introAct.submitted;
  const chalTried = qs.chal.submitted;

  const Selections = () => (
    <div className="sel-strip" data-testid="strip-selections" aria-label="Your selections">
      <span>Experience: <strong data-testid="text-experience">{exp === "new" ? "New to this" : exp === "some" ? "I have some experience" : "not chosen"}</strong></span>
      {diagDone && <span>Recommended: <strong data-testid="text-recommended">{rec === "intro" ? "Introduction" : "Challenge"}</strong></span>}
      {route && <span>Chosen route: <strong data-testid="text-route">{route === "intro" ? "Introduction" : "Challenge"}</strong></span>}
    </div>
  );

  return (
    <>
      <div className="banner" role="note" data-testid="text-disclosure">
        Prototype demo: skill analysis and feedback use prepared examples; live AI is not connected. Progress is not saved after reload. Inputs are not sent externally.
      </div>
      <main className="shell">
        <h1>STEM Industry Skills — SPC Practice Prototype</h1>
        <p className="sub">A five-minute first step for final-year laboratory STEM PhD researchers: connect lab experience to how industry reads statistical process control (SPC). It does not promise workplace competence.</p>
        <ol className="steps" aria-label="Progress" data-testid="progress">
          {STEPS.map((s, i) => (
            <li key={s} className={i + 1 < step ? "done" : ""} aria-current={i + 1 === step ? "step" : undefined}>{i + 1}. {s}</li>
          ))}
        </ol>
        <div ref={top} tabIndex={-1} style={{ outline: "none" }} />

        {step === 1 && (
          <section className="card" aria-labelledby="h-1">
            <h2 id="h-1">Step 1. Set a target</h2>
            <p>Paste a job description and a short skills summary. This prototype only analyzes the two fictional samples below.</p>
            <div className="row" style={{ marginTop: 0 }}>
              <button type="button" className="btn alt" data-testid="button-load-sample" onClick={() => { setJob(SAMPLE_JOB); setSkills(SAMPLE_SKILLS); setSubmitted(false); resetDownstream(); }}>Load sample scenario</button>
              <span className="tag">Fictional posting and fictional learner</span>
            </div>
            <form noValidate onSubmit={(e) => { e.preventDefault(); setSubmitted(true); if (analyze(job, skills).status === "sample") go(2); }}>
              <label htmlFor="job">Job description <span className="sub">(sample is a fictional posting)</span></label>
              <textarea id="job" value={job} onChange={(e) => editInputs(setJob)(e.target.value)} aria-invalid={!!inv?.jobError} aria-describedby={inv?.jobError ? "job-err" : undefined} data-testid="input-job" />
              {inv?.jobError && <p className="err" id="job-err" role="alert" data-testid="error-job">{inv.jobError}</p>}
              <label htmlFor="skills">Skills summary <span className="sub">(sample is a fictional learner)</span></label>
              <textarea id="skills" value={skills} onChange={(e) => editInputs(setSkills)(e.target.value)} aria-invalid={!!inv?.skillsError} aria-describedby={inv?.skillsError ? "skills-err" : undefined} data-testid="input-skills" />
              {inv?.skillsError && <p className="err" id="skills-err" role="alert" data-testid="error-skills">{inv.skillsError}</p>}
              {unsupported && (
                <div className="note" role="alert" data-testid="text-unsupported">
                  <strong>Unsupported content.</strong> This prototype has no live AI and cannot analyze text other than the two fictional samples. Your input has been kept, not interpreted.
                  <div className="row"><button type="button" className="btn alt" data-testid="button-restore-sample" onClick={() => { setJob(SAMPLE_JOB); setSkills(SAMPLE_SKILLS); setSubmitted(false); resetDownstream(); }}>Restore sample</button></div>
                </div>
              )}
              <div className="row"><button className="btn" type="submit" data-testid="button-submit-target">Analyze and continue</button></div>
            </form>
          </section>
        )}

        {step === 2 && (
          <section className="card" aria-labelledby="h-2">
            <h2 id="h-2">Step 2. Confirm the gap</h2>
            <h3>Potential gap: statistical process control</h3>
            <p>The fictional posting asks you to:</p>
            <blockquote>monitor thin-film process measurements using statistical process control</blockquote>
            <p>The fictional learner summary states:</p>
            <blockquote>No formal SPC or manufacturing experience.</blockquote>
            <p>That pairing makes SPC a <strong>potential</strong> gap. It is based on what is stated, not on a test of ability. Missing information alone would not be proof of a gap.</p>
            <form onSubmit={(e) => { e.preventDefault(); if (exp && skill === "spc") { if (!route) setRoute(initialRoute(exp)); go(3); } }}>
              <fieldset>
                <legend>Which skill do you want to practice?</legend>
                <label className={`opt${skill === "spc" ? " sel" : ""}`}><input type="radio" name="skill" checked={skill === "spc"} onChange={() => setSkill("spc")} data-testid="radio-skill-spc" /><span>Statistical process control (SPC)</span></label>
                <label className={`opt${skill === "automation" ? " sel" : ""}`}><input type="radio" name="skill" checked={skill === "automation"} onChange={() => setSkill("automation")} data-testid="radio-skill-automation" /><span>Instrument automation</span></label>
              </fieldset>
              {skill === "automation" && (
                <div className="note" role="status" data-testid="text-automation-limit">
                  Instrument automation is outside what this prototype supports. It only has a prepared SPC activity.
                  <div className="row"><button type="button" className="btn alt" onClick={() => setSkill("spc")} data-testid="button-return-spc">Return to SPC</button></div>
                </div>
              )}
              <fieldset>
                <legend>Your experience with SPC (required)</legend>
                {([["new", "New to this"], ["some", "I have some experience"]] as const).map(([v, l]) => (
                  <label key={v} className={`opt${exp === v ? " sel" : ""}`}>
                    <input type="radio" name="exp" checked={exp === v} data-testid={`radio-exp-${v}`}
                      onChange={() => { if (exp !== v) { resetPractice(); setExp(v); setRoute(initialRoute(v)); } }} />
                    <span>{l}</span>
                  </label>
                ))}
                <p className="sub">This sets your starting route: new goes to the introduction, some experience goes to the challenge. A diagnostic comes first, and you stay in control of the route.</p>
              </fieldset>
              {exp && <Selections />}
              <div className="row">
                <button type="button" className="btn alt" onClick={() => go(1)} data-testid="button-back-1">Back</button>
                <button type="submit" className="btn" disabled={!exp || skill !== "spc"} data-testid="button-continue-2">Continue to diagnostic</button>
              </div>
            </form>
          </section>
        )}

        {step === 3 && exp && route && (
          <section className="card" aria-labelledby="h-3">
            <h2 id="h-3">Step 3. {phase === "diagnostic" ? "One-question diagnostic" : routeName(phase)}</h2>
            <Selections />
            <p className="tag" style={{ marginTop: ".8rem" }}>Fictional data only</p>

            {phase === "diagnostic" && (
              <>
                <Quiz {...props(DIAG, "diag")} />
                {diagDone && rec && (
                  <div data-testid="panel-route">
                    <h3>Choose your route</h3>
                    {rec !== route ? (
                      <p className="note" data-testid="text-route-differs">
                        Your starting route was <strong>{route === "intro" ? "Introduction" : "Challenge"}</strong> based on your stated experience ({exp === "new" ? "new to this" : "some experience"}). The diagnostic suggests <strong>{rec === "intro" ? "Introduction" : "Challenge"}</strong>. Your choice is kept until you accept the suggestion or pick the other route.
                      </p>
                    ) : (
                      <p className="note" data-testid="text-route-same">The diagnostic recommendation matches your starting route: <strong>{rec === "intro" ? "Introduction" : "Challenge"}</strong>.</p>
                    )}
                    <fieldset>
                      <legend>Route</legend>
                      {(["intro", "challenge"] as Route[]).map((r) => (
                        <label key={r} className={`opt${route === r ? " sel" : ""}`}>
                          <input type="radio" name="route" checked={route === r} onChange={() => setRoute(r)} data-testid={`radio-route-${r}`} />
                          <span><strong>{r === "intro" ? "Introduction" : "Challenge"}</strong>{r === rec ? " (recommended)" : ""}<br /><span className="sub">{r === "intro" ? "Learn what a control chart shows and find the signal." : "Separate control limits from engineering specifications."}</span></span>
                        </label>
                      ))}
                    </fieldset>
                    <div className="row">
                      {rec !== route && <button type="button" className="btn alt" onClick={() => setRoute(rec)} data-testid="button-accept-recommendation">Accept recommendation</button>}
                      <button type="button" className="btn" onClick={() => startRoute(route)} data-testid="button-start-route">Start {route === "intro" ? "introduction" : "challenge"}</button>
                    </div>
                  </div>
                )}
                <div className="row"><button type="button" className="btn alt" onClick={() => go(2)} data-testid="button-back-2">Back to experience</button></div>
              </>
            )}

            {phase === "intro" && (
              <>
                <p>A control chart plots measurements over time against limits established for the process. A point outside the limits warrants investigation. By itself, it does not identify the cause.</p>
                <p>The limits below are illustrative values from a fictional prior baseline. They are not calculated from these eight readings.</p>
                <p className="sub">This activity checks only the displayed beyond-limit rule. Points inside the limits alone do not prove process stability.</p>
                <SpcChart />
                <Quiz {...props(INTRO_OBS, "introObs")} />
                {introObsOk && <Quiz {...props(INTRO_ACT, "introAct")} />}
                {introActOk && (
                  <div className="note" data-testid="panel-intro-success">Introduction attempted and completed correctly. Next: try the optional challenge, or go to the review.</div>
                )}
                <div className="row">
                  {introActOk && <button className="btn alt" onClick={() => openPractice("challenge", ["chal"])} data-testid="button-optional-challenge">Try optional challenge</button>}
                  <button className="btn" onClick={() => go(4)} data-testid="button-to-review">{introActOk ? "Continue to review" : "Review progress"}</button>
                  <button className="btn alt" onClick={() => setPhase("diagnostic")} data-testid="button-back-route">Back to route choice</button>
                </div>
              </>
            )}

            {phase === "challenge" && (
              <>
                <p>Same fictional measurements and control limits, now with fictional engineering specifications of 94 and 106 nm. Control limits come from process behavior; specifications come from requirements.</p>
                <SpcChart showSpecs />
                <Quiz {...props(CHAL, "chal")} />
                <div className="row">
                  <button className="btn" onClick={() => go(4)} data-testid="button-to-review">{chalOk ? "Continue to review" : "Review progress"}</button>
                  <button className="btn alt" onClick={() => setPhase("diagnostic")} data-testid="button-back-route">Back to route choice</button>
                </div>
              </>
            )}
          </section>
        )}

        {step === 4 && (
          <section className="card" aria-labelledby="h-4">
            <h2 id="h-4">Step 4. Review</h2>
            <Selections />
            <h3>What you practiced</h3>
            {!introTried && !chalTried ? (
              <p data-testid="text-nothing-attempted">No practice was attempted yet. Nothing is recorded as practiced.</p>
            ) : (
              <>
                <p data-testid="text-practiced">Practiced recognizing a control-chart signal using fictional data only, for the attempted practice listed below. This is not a measure of workplace competence.</p>
                <p className="sub">Routes started: {started.length ? started.map((r) => (r === "intro" ? "Introduction" : "Challenge")).join(", ") : "none"}.</p>
                <ul>
                  {([
                    ["introObs", INTRO_OBS, "Introduction: find the beyond-limit point"],
                    ["introAct", INTRO_ACT, "Introduction: next action after a signal"],
                    ["chal", CHAL, "Challenge: control limits vs. specifications"],
                  ] as const).map(([k, q, label]) => {
                    const s = qs[k];
                    if (!s.submitted) return null;
                    const o = q.options.find((x) => x.id === s.selected)!;
                    return <li key={k} data-testid={`review-${k}`}><strong>{label}.</strong> {o.correct ? "Latest answer correct." : "Latest answer not correct."} Attempts: {s.attempts}. Feedback shown: {o.feedback}</li>;
                  })}
                </ul>
              </>
            )}
            {diagDone && <p className="sub">Diagnostic feedback shown: {DIAG.options.find((o) => o.id === qs.diag.selected)?.feedback}</p>}
            <div className="row">
              {introTried && !chalTried && <button className="btn" onClick={() => openPractice("challenge", ["chal"])} data-testid="button-next-challenge">Try the challenge</button>}
              {chalTried && !introTried && <button className="btn" onClick={() => openPractice("intro", ["introObs", "introAct"])} data-testid="button-next-intro">Try the introduction</button>}
              {introTried && <button className="btn alt" onClick={() => openPractice("intro", ["introObs", "introAct"])} data-testid="button-retry-intro">Retry introduction</button>}
              {chalTried && <button className="btn alt" onClick={() => openPractice("challenge", ["chal"])} data-testid="button-retry-challenge">Retry challenge</button>}
              <button className="btn alt" onClick={() => { if (route) { setPhase(route); } go(3); }} data-testid="button-back-practice">Back</button>
              <button className="btn alt" onClick={restart} data-testid="button-restart">Restart and clear everything</button>
            </div>
          </section>
        )}

        <details data-testid="section-about">
          <summary>About and limits</summary>
          <p>A future AI-enabled version could interpret varied job descriptions and learner backgrounds and give contextual feedback. This deterministic version does not: it only recognizes the two fictional samples and gives prepared feedback.</p>
          <p>This is the First Working Slice of the Current State of Generative AI semester project.</p>
          <ul>
            <li><a href="https://itl.nist.gov/div898/handbook/pmc/section1/pmc14.htm" target="_blank" rel="noreferrer">NIST Handbook: How are control charts used? (pmc14)</a></li>
            <li><a href="https://www.itl.nist.gov/div898/handbook/pmc/section3/pmc31.htm" target="_blank" rel="noreferrer">NIST Handbook: Control charts (pmc31)</a></li>
          </ul>
        </details>
      </main>
    </>
  );
}
