import type { Question } from "@/lib/spc";

export type QState = { selected: string | null; submitted: boolean; attempts: number };
export const emptyQ: QState = { selected: null, submitted: false, attempts: 0 };

export function Quiz({ q, state, onSelect, onSubmit, onRetry, locked = false }: {
  q: Question; state: QState; onSelect: (id: string) => void; onSubmit: () => void; onRetry: () => void; locked?: boolean;
}) {
  const picked = q.options.find((o) => o.id === state.selected);
  const ok = !!picked?.correct;
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (state.selected && !state.submitted) onSubmit(); }}>
      <fieldset disabled={state.submitted || locked}>
        <legend>{q.prompt}</legend>
        {q.options.map((o) => (
          <label key={o.id} className={`opt${state.selected === o.id ? " sel" : ""}`}>
            <input type="radio" name={q.id} value={o.id} checked={state.selected === o.id}
              onChange={() => onSelect(o.id)} data-testid={`radio-${q.id}-${o.id}`} />
            <span>{o.label}</span>
          </label>
        ))}
      </fieldset>
      {!state.submitted && (
        <div className="row">
          <button className="btn" type="submit" disabled={!state.selected || locked} data-testid={`button-submit-${q.id}`}>Check answer</button>
        </div>
      )}
      {state.submitted && picked && (
        <div className={`fb${ok ? "" : " bad"}`} role="status" data-testid={`feedback-${q.id}`}>
          <strong>{ok ? "Correct" : "Not yet"}</strong>
          <p>{picked.feedback}</p>
          {!ok && <button type="button" className="btn alt" onClick={onRetry} data-testid={`button-retry-${q.id}`}>Try again</button>}
        </div>
      )}
    </form>
  );
}
