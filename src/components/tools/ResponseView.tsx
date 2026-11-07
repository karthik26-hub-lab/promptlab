/*
  Shows the state of one AI request:
    loading → dot-matrix loader
    error   → friendly message (+ link to Settings when it's a key problem)
    done    → the answer, with a Copy button
*/
import { Link } from "react-router-dom";
import type { GenerateState } from "../../ai/useGenerate";
import { DotLoader } from "../ui/DotLoader";
import { Markdown } from "../ui/Markdown";
import { CopyButton } from "./CopyButton";

interface Props {
  state: GenerateState;
  emptyText?: string; // shown before anything is sent
  scroll?: boolean;   // limit height and scroll (used in side-by-side views)
}

export function ResponseView({ state, emptyText, scroll = false }: Props) {
  if (state.status === "idle") {
    return emptyText ? <div className="response response--empty label faint">{emptyText}</div> : null;
  }

  if (state.status === "loading") {
    return (
      <div className="response response--loading">
        <DotLoader label="Gemini is thinking" />
      </div>
    );
  }

  if (state.status === "error") {
    const { kind, message } = state.error;
    const keyProblem = kind === "no-key" || kind === "invalid-key" || kind === "bad-model";
    return (
      <div className="notice notice--alert" role="alert">
        <p>{message}</p>
        {keyProblem && (
          <Link to="/settings" className="btn label" style={{ marginTop: 12 }}>
            Open Settings →
          </Link>
        )}
      </div>
    );
  }

  // Done
  return (
    <div className="response">
      <div className="response__bar">
        <span className="label faint">
          Answer{state.seconds > 0 && ` · ${state.seconds.toFixed(1)}s`}
        </span>
        <CopyButton text={state.text} />
      </div>
      <div className={scroll ? "result-box result-box--scroll" : "result-box"} tabIndex={scroll ? 0 : undefined}>
        <Markdown text={state.text} />
      </div>
    </div>
  );
}
