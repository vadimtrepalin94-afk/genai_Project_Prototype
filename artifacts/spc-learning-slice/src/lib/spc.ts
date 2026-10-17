export const SAMPLE_JOB =
  "Semiconductor process engineer. Monitor thin-film process measurements using statistical process control, investigate unusual process variation, communicate findings, and collaborate on instrument automation.";
export const SAMPLE_SKILLS =
  "Final-year materials/physical chemistry PhD with spectroscopy, experimental design and data analysis experience. No formal SPC or manufacturing experience.";

export type Analysis =
  | { status: "invalid"; jobError?: string; skillsError?: string }
  | { status: "unsupported" }
  | { status: "sample" };

export function analyze(job: string, skills: string): Analysis {
  const j = job.trim();
  const s = skills.trim();
  if (!j || !s) {
    return {
      status: "invalid",
      jobError: j ? undefined : "Enter a job description, or load the sample scenario.",
      skillsError: s ? undefined : "Enter a skills summary, or load the sample scenario.",
    };
  }
  return j === SAMPLE_JOB && s === SAMPLE_SKILLS ? { status: "sample" } : { status: "unsupported" };
}

export const READINGS = [100, 101, 99, 100, 102, 101, 105, 100];
export const CENTER = 100;
export const LCL = 97;
export const UCL = 103;
export const SPEC_LOW = 94;
export const SPEC_HIGH = 106;

export function beyondLimits(readings = READINGS): number[] {
  return readings.flatMap((v, i) => (v < LCL || v > UCL ? [i + 1] : []));
}

export type Route = "intro" | "challenge";
export type Experience = "new" | "some";

export const initialRoute = (e: Experience): Route => (e === "new" ? "intro" : "challenge");

export type Option = { id: string; label: string; correct?: boolean; feedback: string };
export type Question = { id: string; prompt: string; options: Option[] };

export const DIAG: Question = {
  id: "diag",
  prompt: "On a control chart, one point falls beyond a control limit. What does that most reasonably mean?",
  options: [
    { id: "a", label: "A signal that warrants investigation for a possible special cause.", correct: true,
      feedback: "Correct. A point beyond the limits is unusual relative to the established process behavior, so it calls for investigation. It does not name the cause." },
    { id: "b", label: "The product made at that moment is guaranteed to be defective.", feedback: "Not quite. Control limits describe process behavior, not product requirements. A signal can occur while product is still within specification." },
    { id: "c", label: "Proof that one specific machine has failed.", feedback: "Not quite. A signal says something unusual happened, not what. Many causes are possible, including the measurement itself." },
  ],
};

export const INTRO_OBS: Question = {
  id: "introObs",
  prompt: "Using only the beyond-limit rule (a point above the UCL or below the LCL), which observation triggers it?",
  options: READINGS.map((v, i) => {
    const n = i + 1;
    const correct = n === 7;
    return {
      id: String(n),
      label: `Observation ${n}`,
      correct,
      feedback: correct
        ? "Correct. Observation 7 is 105 nm, above the UCL of 103 nm. It is the only point beyond a limit."
        : `Observation ${n} is ${v} nm, inside the 97 to 103 nm limits, so it does not trigger this rule. Being inside the limits alone does not prove the process is stable; this exercise checks only the beyond-limit rule.`,
    };
  }),
};

export const INTRO_ACT: Question = {
  id: "introAct",
  prompt: "Observation 7 signals. What is the best next action?",
  options: [
    { id: "a", label: "Follow the investigation procedure and check measurement and process records.", correct: true,
      feedback: "Correct. A signal prompts investigation of possible special causes, starting with records for the measurement and the process." },
    { id: "b", label: "Widen the control limits so the point falls inside.", feedback: "No. Moving limits to hide a signal removes the check's purpose. Limits are revised only on evidence the process has changed." },
    { id: "c", label: "Declare every product made so far defective.", feedback: "No. The signal does not show product failed requirements. Investigate first." },
    { id: "d", label: "Change process settings right away without investigating.", feedback: "No. Adjusting without finding a cause can add variation and hide what happened." },
  ],
};

export const CHAL: Question = {
  id: "chal",
  prompt: "Observation 7 (105 nm) is inside the specification range of 94 to 106 nm. Can it be within specification and still signal unusual behavior?",
  options: [
    { id: "a", label: "Yes. Control limits describe process behavior; specifications describe requirements.", correct: true,
      feedback: "Correct. 105 nm meets the specification but sits beyond the control limit, so investigation is warranted even though the requirement is met." },
    { id: "b", label: "No. Being within specification guarantees the process is in statistical control.", feedback: "No. Specifications say nothing about whether the process is behaving consistently. Here 105 nm is within specification yet beyond the UCL." },
    { id: "c", label: "No. Any control-chart signal proves a specification violation.", feedback: "No. The two are different questions. A signal can occur while all values still meet specification." },
  ],
};

export const QUESTIONS: Record<string, Question> = {
  diag: DIAG, introObs: INTRO_OBS, introAct: INTRO_ACT, chal: CHAL,
};

export const isCorrect = (q: Question, id: string | null) =>
  !!q.options.find((o) => o.id === id)?.correct;

export const recommend = (diagAnswer: string | null): Route =>
  isCorrect(DIAG, diagAnswer) ? "challenge" : "intro";
