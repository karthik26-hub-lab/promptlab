/*
  LIVE COMPARE: write two prompts (A and B), run both, see the answers side by side.
  The two requests run one after the other (not at the same time),
  which is gentler on the free-tier rate limit.
*/
import { useId, useState } from "react";
import { useGenerate } from "../../ai/useGenerate";
import { ResponseView } from "./ResponseView";
import { SendButton } from "./SendButton";
import { StatusDot } from "../ui/StatusDot";

interface Props {
  initialA?: string;
  initialB?: string;
  labelA?: string;
  labelB?: string;
  rows?: number;
}

export function CompareRunner({ initialA = "", initialB = "", labelA = "Prompt A", labelB = "Prompt B", rows = 4 }: Props) {
  const [promptA, setPromptA] = useState(initialA);
  const [promptB, setPromptB] = useState(initialB);
  const id = useId(); // unique ids, so two compare boxes on one page don't clash
  const a = useGenerate();
  const b = useGenerate();

  const loading = a.state.status === "loading" || b.state.status === "loading";
  const canRun = promptA.trim() !== "" && promptB.trim() !== "" && !loading;

  async function runBoth() {
    if (!canRun) return;
    b.reset();
    const first = await a.run(promptA.trim());
    // If A failed (no key, rate limit…), don't waste a request on B.
    if (!first.ok) return;
    await b.run(promptB.trim());
  }

  return (
    <div className="card compare-runner">
      <div className="compare">
        <div className="compare__side">
          <label className="label compare__label" htmlFor={`${id}-a`}>
            <StatusDot tone="off" />
            {labelA}
          </label>
          <textarea id={`${id}-a`} className="prompt-input" rows={rows} value={promptA} onChange={(e) => setPromptA(e.target.value)} disabled={loading} />
        </div>
        <div className="compare__side">
          <label className="label compare__label" htmlFor={`${id}-b`}>
            <StatusDot />
            {labelB}
          </label>
          <textarea id={`${id}-b`} className="prompt-input" rows={rows} value={promptB} onChange={(e) => setPromptB(e.target.value)} disabled={loading} />
        </div>
      </div>

      <div className="practice__actions">
        <SendButton onClick={runBoth} loading={loading} disabled={!canRun} label="Run both" />
        <span className="label faint practice__hint">Uses 2 requests</span>
      </div>

      <div className="compare compare--answers">
        <div className="compare__side">
          <ResponseView state={a.state} scroll emptyText="Answer A appears here" />
        </div>
        <div className="compare__side">
          <ResponseView state={b.state} scroll emptyText={a.state.status === "error" ? "Skipped" : "Answer B appears here"} />
        </div>
      </div>
    </div>
  );
}
