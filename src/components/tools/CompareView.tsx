/*
  COMPARE VIEW: two prompts and their answers, side by side.
  It only displays. Data can come from anywhere: saved results, fixed
  examples, or the live CompareRunner.
*/
import type { ReactNode } from "react";
import { StatusDot } from "../ui/StatusDot";

export interface CompareSide {
  label: string;           // e.g. "Your first prompt"
  prompt: string;
  answer: ReactNode;       // usually a <ResponseView> or <Markdown>
  highlight?: boolean;     // red dot on the "better" side
}

export function CompareView({ left, right }: { left: CompareSide; right: CompareSide }) {
  return (
    <div className="compare">
      <Side side={left} />
      <Side side={right} />
    </div>
  );
}

function Side({ side }: { side: CompareSide }) {
  return (
    <div className="compare__side">
      <p className="label compare__label">
        <StatusDot tone={side.highlight ? "red" : "off"} />
        {side.label}
      </p>
      <div className="prompt-box">{side.prompt || <span className="faint">(empty)</span>}</div>
      {side.answer}
    </div>
  );
}
