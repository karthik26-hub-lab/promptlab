/*
  "Save to library" button. Opens a small inline form (title + tags).
  Put it inside an actions row; the form takes a full line under the buttons.
*/
import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { addToLibrary, parseTags, suggestTitle } from "../../storage/library";

export function SaveToLibrary({ prompt }: { prompt: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [savedFor, setSavedFor] = useState<string | null>(null); // the prompt text that was saved

  // After saving, show a confirmation until the prompt changes.
  if (savedFor !== null && savedFor === prompt && !open) {
    return (
      <Link to="/library" className="btn btn--quiet label">
        In library ✓
      </Link>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        className="btn btn--quiet label"
        onClick={() => {
          setTitle(suggestTitle(prompt));
          setOpen(true);
        }}
      >
        Save to library
      </button>
    );
  }

  function save() {
    addToLibrary({ title, prompt, tags: parseTags(tags) });
    setSavedFor(prompt);
    setOpen(false);
    setTags("");
  }

  return (
    <div className="save-form">
      <div className="save-form__fields">
        <div>
          <label className="label muted field-label" htmlFor={`${id}-title`}>
            Title
          </label>
          <input id={`${id}-title`} className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="label muted field-label" htmlFor={`${id}-tags`}>
            Tags <span className="faint">(comma separated)</span>
          </label>
          <input
            id={`${id}-tags`}
            className="input"
            value={tags}
            placeholder="study, exam"
            onChange={(e) => setTags(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
          />
        </div>
      </div>
      <div className="button-row">
        <button type="button" className="btn label" onClick={save}>
          Save
        </button>
        <button type="button" className="btn btn--quiet label" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
}
