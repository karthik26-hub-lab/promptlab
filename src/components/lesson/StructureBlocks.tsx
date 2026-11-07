/*
  Stage 3 teaching blocks:
    analogy → one building block (Role, Task…) with a real-life comparison + prompt example
    anatomy → a full prompt split into labelled parts
*/
import type { AnalogyBlock, AnatomyBlock } from "../../content/types";

export function AnalogyView({ block, number }: { block: AnalogyBlock; number: number }) {
  return (
    <div className="lesson-block card analogy">
      <div className="analogy__head">
        <span className="analogy__num dot">{String(number).padStart(2, "0")}</span>
        <div>
          <h3 className="analogy__name dot">{block.name}</h3>
          <p className="muted">{block.question}</p>
        </div>
      </div>

      <div className="analogy__body">
        <div>
          <p className="label faint">In real life</p>
          <p className="analogy__text">{block.analogy}</p>
        </div>
        <div>
          <p className="label faint">In a prompt</p>
          <div className="prompt-box">{block.example}</div>
        </div>
      </div>

      {block.tip && (
        <p className="analogy__tip small muted">
          <span className="label">Tip</span> {block.tip}
        </p>
      )}
    </div>
  );
}

export function AnatomyView({ block }: { block: AnatomyBlock }) {
  return (
    <div className="lesson-block">
      {block.heading && <h3 className="lesson-h3">{block.heading}</h3>}
      <div className="anatomy">
        {block.parts.map((part) => (
          <div key={part.label} className="anatomy__row">
            <span className="anatomy__label label">{part.label}</span>
            <span className="anatomy__text">{part.text}</span>
          </div>
        ))}
      </div>
      {block.note && <p className="muted small anatomy__note">{block.note}</p>}
    </div>
  );
}
