/*
  "What can you do with a prompt?" tour.
  A list of skills on the left; picking one shows its tiny example on the right.
*/
import { useState } from "react";
import type { TourBlock } from "../../content/types";
import { Markdown } from "../ui/Markdown";
import { StatusDot } from "../ui/StatusDot";

export function TourView({ block }: { block: TourBlock }) {
  const [selected, setSelected] = useState(0);
  const item = block.items[selected];

  return (
    <div className="lesson-block">
      {block.heading && <h3 className="lesson-h3">{block.heading}</h3>}
      <div className="tour">
        {/* Skill list */}
        <div className="tour__list" role="tablist" aria-label="Things you can do">
          {block.items.map((it, i) => (
            <button
              key={it.skill}
              type="button"
              role="tab"
              aria-selected={i === selected}
              className={i === selected ? "tour__tab label is-active" : "tour__tab label"}
              onClick={() => setSelected(i)}
            >
              <span className="tour__tab-num">{String(i + 1).padStart(2, "0")}</span>
              {it.skill}
              {i === selected && <StatusDot />}
            </button>
          ))}
        </div>

        {/* Example for the selected skill */}
        <div className="tour__panel" role="tabpanel">
          <p className="label faint">Prompt</p>
          <div className="prompt-box">{item.prompt}</div>
          <p className="label faint">Result</p>
          <div className="result-box">
            <Markdown text={item.result} />
          </div>
        </div>
      </div>
    </div>
  );
}
