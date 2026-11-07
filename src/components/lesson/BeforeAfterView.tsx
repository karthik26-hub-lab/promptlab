/*
  Bad prompt vs good prompt, side by side, each with its (fixed) result.
  Below: what the good prompt added, and why it worked.
*/
import type { BeforeAfterBlock, FixedExample } from "../../content/types";
import { Markdown } from "../ui/Markdown";
import { StatusDot } from "../ui/StatusDot";

export function BeforeAfterView({ block, number }: { block: BeforeAfterBlock; number: number }) {
  return (
    <div className="lesson-block card before-after">
      <div className="before-after__head">
        <span className="before-after__num dot">{String(number).padStart(2, "0")}</span>
        <h3 className="lesson-h3">{block.task}</h3>
      </div>

      <div className="before-after__cols">
        <Column label="Before" example={block.bad} good={false} />
        <Column label="After" example={block.good} good />
      </div>

      <div className="before-after__why">
        {block.added && block.added.length > 0 && (
          <div className="before-after__tags">
            <span className="label faint">What it added</span>
            {block.added.map((tag) => (
              <span key={tag} className="tag label">
                + {tag}
              </span>
            ))}
          </div>
        )}
        <p>{block.why}</p>
      </div>
    </div>
  );
}

function Column({ label, example, good }: { label: string; example: FixedExample; good: boolean }) {
  return (
    <div className="before-after__col">
      <p className="label before-after__label">
        <StatusDot tone={good ? "red" : "off"} />
        {label}
      </p>
      <div className="prompt-box">{example.prompt}</div>
      <p className="label faint">Result</p>
      {/* Long answers scroll inside the box so both columns stay the same height. */}
      <div className="result-box result-box--scroll" tabIndex={0} aria-label={`${label} result`}>
        <Markdown text={example.result} />
      </div>
    </div>
  );
}
