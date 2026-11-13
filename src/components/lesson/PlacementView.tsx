/*
  Instruction placement test (Stage 4).
  Same instruction, same article. A = instruction first, B = instruction last.
  Runs one after the other (gentler on the free limit), then shows both side by side.
*/
import { useState } from "react";
import type { PlacementBlock } from "../../content/types";
import { useGenerate } from "../../ai/useGenerate";
import { saveResult } from "../../storage/saved";
import { ResponseView } from "../tools/ResponseView";
import { SendButton } from "../tools/SendButton";
import { Markdown } from "../ui/Markdown";
import { StatusDot } from "../ui/StatusDot";

export function PlacementView({ block }: { block: PlacementBlock }) {
  const [instruction, setInstruction] = useState(block.defaultInstruction);
  const first = useGenerate();
  const last = useGenerate();
  const loading = first.state.status === "loading" || last.state.status === "loading";

  async function runBoth() {
    const text = instruction.trim();
    last.reset();
    const a = await first.run(`${text}\n\n${block.article}`);
    if (!a.ok) return; // no key, rate limit… don't waste the second request
    const b = await last.run(`${block.article}\n\n${text}`);
    if (b.ok) saveResult(block.saveAs, text, b.text);
  }

  return (
    <div className="lesson-block">
      {block.heading && <h3 className="lesson-h3">{block.heading}</h3>}
      {block.intro && <p className="muted lesson-intro">{block.intro}</p>}

      <div className="card">
        <label className="label muted field-label" htmlFor={`instr-${block.saveAs}`}>
          Your instruction
        </label>
        <textarea
          id={`instr-${block.saveAs}`}
          className="prompt-input"
          rows={2}
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          disabled={loading}
        />

        {/* The long article, folded so it doesn't take over the page */}
        <details className="placement__article">
          <summary className="label">
            The article: {block.articleTitle} · {block.article.split(/\s+/).length} words (tap to read)
          </summary>
          <div className="result-box result-box--scroll">
            <Markdown text={block.article} />
          </div>
        </details>

        <div className="practice__actions">
          <SendButton onClick={runBoth} loading={loading} disabled={!instruction.trim()} label="Run both" />
          <span className="label faint practice__hint">Uses 2 requests</span>
        </div>

        <div className="compare compare--answers">
          <div className="compare__side">
            <p className="label compare__label">
              <StatusDot tone="off" /> Instruction at the start
            </p>
            <ResponseView state={first.state} scroll emptyText="Answer appears here" />
          </div>
          <div className="compare__side">
            <p className="label compare__label">
              <StatusDot /> Instruction at the end
            </p>
            <ResponseView
              state={last.state}
              scroll
              emptyText={first.state.status === "error" ? "Skipped" : "Answer appears here"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
