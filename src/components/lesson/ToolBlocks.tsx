/*
  Lesson blocks that use the live tools:
    practice → a PracticeBox
    compare  → two SAVED results side by side (e.g. Stage 2 first try vs Stage 3 improved)
*/
import type { CompareBlock, PracticeBlock } from "../../content/types";
import { useSavedResult } from "../../storage/saved";
import { CompareView } from "../tools/CompareView";
import { PracticeBox } from "../tools/PracticeBox";
import { Markdown } from "../ui/Markdown";

export function PracticeBlockView({ block }: { block: PracticeBlock }) {
  // Optionally start the box with a prompt saved earlier (e.g. the Stage 2 attempt).
  const prefill = useSavedResult(block.prefillFrom);

  return (
    <div className="lesson-block">
      {block.heading && <h3 className="lesson-h3">{block.heading}</h3>}
      {block.intro && <p className="muted lesson-intro">{block.intro}</p>}
      <PracticeBox saveAs={block.saveAs} suggestions={block.suggestions} initialPrompt={prefill?.prompt ?? ""} />
    </div>
  );
}

export function CompareBlockView({ block }: { block: CompareBlock }) {
  const left = useSavedResult(block.left.from);
  const right = useSavedResult(block.right.from);

  return (
    <div className="lesson-block">
      {block.heading && <h3 className="lesson-h3">{block.heading}</h3>}
      {left && right ? (
        <div className="card">
          <CompareView
            left={{ label: block.left.label, prompt: left.prompt, answer: <AnswerBox text={left.result} /> }}
            right={{ label: block.right.label, prompt: right.prompt, answer: <AnswerBox text={right.result} />, highlight: true }}
          />
        </div>
      ) : (
        <div className="card">
          <p className="label faint">Nothing to compare yet</p>
          <p className="muted" style={{ marginTop: 8 }}>
            {left ? "Run your improved prompt above" : "Run your prompt above first"}, then your comparison appears here.
          </p>
        </div>
      )}
    </div>
  );
}

function AnswerBox({ text }: { text: string }) {
  return (
    <div className="result-box result-box--scroll" tabIndex={0}>
      <Markdown text={text} />
    </div>
  );
}
