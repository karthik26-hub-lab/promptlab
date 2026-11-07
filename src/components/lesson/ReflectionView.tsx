/*
  Reflection: tap-to-select options (one or more groups) + a free text box.
  Answers save automatically as the learner taps or types.
  If `after` is set, it stays locked until that saved result exists.
*/
import type { ReflectionBlock } from "../../content/types";
import { reflections, saveReflection } from "../../storage/reflections";
import { useSavedResult } from "../../storage/saved";

export function ReflectionView({ block }: { block: ReflectionBlock }) {
  const all = reflections.use();
  const current = all[block.id] ?? { selected: [], note: "" };
  const unlockedBy = useSavedResult(block.after);
  const locked = Boolean(block.after) && !unlockedBy;

  function toggle(option: string) {
    const selected = current.selected.includes(option)
      ? current.selected.filter((o) => o !== option)
      : [...current.selected, option];
    saveReflection(block.id, { ...current, selected });
  }

  const answered = current.selected.length > 0 || current.note.trim() !== "";

  return (
    <div className="lesson-block card reflection">
      <div className="reflection__head">
        <h3 className="lesson-h3">{block.heading ?? "Reflect"}</h3>
        {answered && !locked && <span className="label faint">Saved ✓</span>}
      </div>

      {locked ? (
        <p className="muted">Send your prompt above first, then come back to this.</p>
      ) : (
        <>
          {block.groups.map((group) => (
            <fieldset key={group.question} className="reflection__group">
              <legend className="label muted">{group.question}</legend>
              <div className="chips">
                {group.options.map((option) => {
                  const on = current.selected.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      className={on ? "chip is-on" : "chip"}
                      aria-pressed={on}
                      onClick={() => toggle(option)}
                    >
                      {on ? "● " : "○ "}
                      {option}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}

          <label className="label muted field-label reflection__note-label" htmlFor={`note-${block.id}`}>
            {block.notePrompt ?? "Anything else? (optional)"}
          </label>
          <textarea
            id={`note-${block.id}`}
            className="input reflection__note"
            rows={3}
            value={current.note}
            onChange={(e) => saveReflection(block.id, { ...current, note: e.target.value })}
            placeholder="Write a line or two…"
          />
        </>
      )}
    </div>
  );
}
