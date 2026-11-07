/*
  PROMPT BUILDER: labelled boxes (role, task, context, format, constraints, examples)
  that assemble into one prompt the learner can copy or run.

  - What's typed is saved as a draft, so leaving the page doesn't lose it.
  - `reference`: a saved prompt (e.g. the Stage 2 attempt) shown above the boxes;
    the Task box starts with it so the learner can rebuild it.
  - `saveAs`: saves the assembled prompt + answer after a successful run.
*/
import { useEffect, useId } from "react";
import { useGenerate } from "../../ai/useGenerate";
import { createStore } from "../../storage/store";
import { saveResult, savedResults, useSavedResult } from "../../storage/saved";
import { DotProgress } from "../ui/DotProgress";
import { CopyButton } from "./CopyButton";
import { ResponseView } from "./ResponseView";
import { SendButton } from "./SendButton";
import { SaveToLibrary } from "./SaveToLibrary";
import { EMPTY_PARTS, assemblePrompt, filledCount, type BuilderParts } from "./assemblePrompt";

/** Drafts for every builder, keyed by its saveAs id. */
const drafts = createStore<Record<string, BuilderParts>>("builderDrafts", {});

/** The six boxes, in order, with their help text. */
const FIELDS: { key: keyof BuilderParts; label: string; hint: string; placeholder: string; rows: number }[] = [
  { key: "role", label: "Role", hint: "Who should answer?", placeholder: "e.g. a patient tutor for first-year students", rows: 1 },
  { key: "task", label: "Task", hint: "What exactly do you want? Start with a verb. (Required)", placeholder: "e.g. Make a 5-day revision plan for my exam", rows: 2 },
  { key: "context", label: "Context", hint: "Who you are, your situation, what you know or tried", placeholder: "e.g. I'm in 2nd year, weak on trees and graphs, 3 hours a day", rows: 3 },
  { key: "format", label: "Format", hint: "What shape should the answer take?", placeholder: "e.g. a table with columns: day, topic, task", rows: 2 },
  { key: "constraints", label: "Constraints", hint: "Limits: length, level, tone, what to avoid", placeholder: "e.g. under 200 words, simple English", rows: 2 },
  { key: "examples", label: "Examples", hint: "Optional: a sample of what you want", placeholder: 'e.g. "Day 1 – Trees: one video, then 3 easy problems"', rows: 2 },
];

interface Props {
  saveAs?: string;
  reference?: string;
}

export function PromptBuilder({ saveAs = "builder", reference }: Props) {
  const id = useId();
  const ai = useGenerate();
  const referenceResult = useSavedResult(reference);
  const allDrafts = drafts.use();

  // Current boxes: the saved draft, or (first time) the reference prompt in Task.
  const parts: BuilderParts = allDrafts[saveAs] ?? { ...EMPTY_PARTS, task: referenceResult?.prompt ?? "" };
  const setPart = (key: keyof BuilderParts, value: string) =>
    drafts.update((all) => ({ ...all, [saveAs]: { ...parts, [key]: value } }));

  // Coming back? Show the answer from the last successful run.
  const { restore } = ai;
  useEffect(() => {
    const saved = savedResults.get()[saveAs];
    if (saved) restore(saved.result);
  }, [saveAs, restore]);

  const finalPrompt = assemblePrompt(parts);
  const loading = ai.state.status === "loading";
  const canRun = parts.task.trim() !== "" && !loading;

  async function run() {
    if (!canRun) return;
    const result = await ai.run(finalPrompt);
    if (result.ok) saveResult(saveAs, finalPrompt, result.text);
  }

  function clearAll() {
    if (!window.confirm("Clear all six boxes?")) return;
    drafts.update((all) => ({ ...all, [saveAs]: { ...EMPTY_PARTS } }));
    ai.reset();
  }

  return (
    <div className="card builder">
      {/* The learner's earlier prompt, for reference */}
      {reference && (
        <div className="builder__reference">
          <p className="label faint">Your Stage 2 prompt</p>
          {referenceResult ? (
            <div className="prompt-box">{referenceResult.prompt}</div>
          ) : (
            <p className="muted small">
              You haven't sent a prompt in Stage 2 yet. That's fine, build any prompt you like here.
            </p>
          )}
        </div>
      )}

      <div className="builder__grid">
        {/* Left: the six boxes */}
        <div className="builder__fields">
          {FIELDS.map((f) => (
            <div key={f.key} className="builder__field">
              <label htmlFor={`${id}-${f.key}`} className="builder__label">
                <span className="label">{f.label}</span>
                <span className="small faint">{f.hint}</span>
              </label>
              <textarea
                id={`${id}-${f.key}`}
                className="input builder__input"
                rows={f.rows}
                value={parts[f.key]}
                placeholder={f.placeholder}
                onChange={(e) => setPart(f.key, e.target.value)}
                disabled={loading}
              />
            </div>
          ))}
        </div>

        {/* Right: the assembled prompt */}
        <div className="builder__preview">
          <div className="builder__preview-head">
            <span className="label faint">Final prompt</span>
            <DotProgress total={6} filled={filledCount(parts)} label={`${filledCount(parts)} of 6 blocks filled`} />
          </div>
          <div className="prompt-box builder__output" aria-live="polite">
            {finalPrompt || <span className="faint">Fill in the boxes. Your prompt builds up here.</span>}
          </div>
          <div className="practice__actions">
            <SendButton onClick={run} loading={loading} disabled={!canRun} label="Run it" />
            {finalPrompt && <CopyButton text={finalPrompt} label="Copy prompt" />}
            {finalPrompt && !loading && (
              <button type="button" className="btn btn--quiet label" onClick={clearAll}>
                Clear
              </button>
            )}
            {parts.task.trim() && !loading && <SaveToLibrary prompt={finalPrompt} />}
          </div>
          {!parts.task.trim() && <p className="small faint" style={{ marginTop: 8 }}>The Task box is the only one you must fill.</p>}
        </div>
      </div>

      <ResponseView state={ai.state} />
    </div>
  );
}
