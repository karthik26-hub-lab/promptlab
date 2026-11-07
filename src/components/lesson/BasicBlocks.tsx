/*
  Simple lesson blocks: section header, text, key points, next-word chart.
  Each one just draws the data from content/stageN.ts.
*/
import type { NextWordBlock, PointsBlock, SectionBlock, TextBlock } from "../../content/types";
import { DotDivider } from "../ui/DotDivider";

/** "PART 02" + big title, with a dotted line above. */
export function SectionView({ block, number }: { block: SectionBlock; number: number }) {
  return (
    <div className="lesson-section">
      <DotDivider />
      <p className="label faint">Part {String(number).padStart(2, "0")}</p>
      <h2 className="lesson-section__title dot">{block.title}</h2>
      {block.intro && <p className="lesson-section__intro muted">{block.intro}</p>}
    </div>
  );
}

export function TextView({ block }: { block: TextBlock }) {
  return (
    <div className="lesson-text">
      {block.heading && <h3 className="lesson-h3">{block.heading}</h3>}
      {block.body.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

/** Numbered cards, one per key idea. */
export function PointsView({ block }: { block: PointsBlock }) {
  return (
    <div className="lesson-block">
      {block.heading && <h3 className="lesson-h3">{block.heading}</h3>}
      <div className="points">
        {block.items.map((item, i) => (
          <div key={i} className="card points__card">
            <span className="points__num dot">{String(i + 1).padStart(2, "0")}</span>
            <h4 className="points__title">{item.title}</h4>
            <p className="muted">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
  "The best way to study is to ▮" + the words the model might pick next,
  each with a 10-dot bar showing how likely it is.
*/
export function NextWordView({ block }: { block: NextWordBlock }) {
  return (
    <div className="lesson-block">
      {block.heading && <h3 className="lesson-h3">{block.heading}</h3>}
      <div className="card next-word">
        <p className="next-word__stem">
          {block.stem} <span className="next-word__cursor" aria-hidden="true" />
        </p>
        <p className="label faint next-word__caption">Likely next words</p>
        <ul className="next-word__list">
          {block.options.map((opt, i) => {
            const dots = Math.max(1, Math.round(opt.percent / 10));
            return (
              <li key={opt.word} className="next-word__row">
                <span className={i === 0 ? "next-word__word is-top" : "next-word__word"}>{opt.word}</span>
                <span className="next-word__bar" aria-hidden="true">
                  {Array.from({ length: 10 }, (_, d) => (
                    <span key={d} className={d < dots ? (i === 0 ? "nw-dot is-top" : "nw-dot is-on") : "nw-dot"} />
                  ))}
                </span>
                <span className="label muted">{opt.percent}%</span>
              </li>
            );
          })}
        </ul>
        <p className="next-word__note muted small">{block.note}</p>
      </div>
    </div>
  );
}
