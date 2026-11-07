/*
  LIBRARY PAGE: the learner's saved prompts.
  Search, filter by tag, copy, edit, delete, or add one by hand.
*/
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHead } from "../components/layout/PageHead";
import { CopyButton } from "../components/tools/CopyButton";
import {
  addToLibrary,
  deleteLibraryItem,
  library,
  parseTags,
  suggestTitle,
  updateLibraryItem,
  type LibraryItem,
} from "../storage/library";

export function LibraryPage() {
  const items = library.use();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  // Every tag used, for the filter row.
  const allTags = useMemo(() => [...new Set(items.flatMap((it) => it.tags))].sort(), [items]);

  // Apply search + tag filter.
  const q = query.trim().toLowerCase();
  const visible = items.filter(
    (it) =>
      (!activeTag || it.tags.includes(activeTag)) &&
      (!q || it.title.toLowerCase().includes(q) || it.prompt.toLowerCase().includes(q)),
  );

  return (
    <>
      <PageHead
        kicker={`Library · ${items.length} saved`}
        title="Library"
        summary="Your best prompts, ready to copy and reuse. Save one from any practice box or the builder."
      />

      {/* Toolbar: search + new */}
      <div className="library__toolbar">
        <input
          className="input"
          type="search"
          placeholder="Search your prompts…"
          aria-label="Search your prompts"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="button" className="btn btn--primary label" onClick={() => setAdding(true)} disabled={adding}>
          + New prompt
        </button>
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="chips library__tags" aria-label="Filter by tag">
          <button type="button" className={activeTag === null ? "chip is-on" : "chip"} onClick={() => setActiveTag(null)}>
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={activeTag === tag ? "chip is-on" : "chip"}
              aria-pressed={activeTag === tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {adding && (
        <ItemEditor
          heading="New prompt"
          onCancel={() => setAdding(false)}
          onSave={(values) => {
            addToLibrary(values);
            setAdding(false);
          }}
        />
      )}

      {/* The list */}
      {items.length === 0 && !adding ? (
        <div className="card library__empty">
          <p className="dot library__empty-title">Empty</p>
          <p className="muted">
            No saved prompts yet. Press <strong>Save to library</strong> under any practice box or in the builder, or{" "}
            <Link to="/playground" className="link">
              try the Playground
            </Link>
            .
          </p>
        </div>
      ) : visible.length === 0 && items.length > 0 ? (
        <p className="muted">Nothing matches that search.</p>
      ) : (
        <div className="library__list">
          {visible.map((item) => (
            <LibraryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  );
}

/* ---------- One saved prompt ---------- */

function LibraryCard({ item }: { item: LibraryItem }) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const long = item.prompt.length > 280 || item.prompt.split("\n").length > 6;

  if (editing) {
    return (
      <ItemEditor
        heading="Edit prompt"
        initial={item}
        onCancel={() => setEditing(false)}
        onSave={(values) => {
          updateLibraryItem(item.id, values);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <article className="card library__item">
      <div className="library__item-head">
        <h3 className="library__item-title">{item.title}</h3>
        <span className="label faint">{new Date(item.updatedAt).toLocaleDateString()}</span>
      </div>
      {item.tags.length > 0 && (
        <div className="library__item-tags">
          {item.tags.map((t) => (
            <span key={t} className="tag label">
              #{t}
            </span>
          ))}
        </div>
      )}
      <div className={long && !expanded ? "prompt-box library__prompt is-clamped" : "prompt-box library__prompt"}>
        {item.prompt}
      </div>
      <div className="button-row library__actions">
        <CopyButton text={item.prompt} />
        {long && (
          <button type="button" className="btn btn--quiet label" onClick={() => setExpanded((e) => !e)}>
            {expanded ? "Show less" : "Show all"}
          </button>
        )}
        <button type="button" className="btn btn--quiet label" onClick={() => setEditing(true)}>
          Edit
        </button>
        <button
          type="button"
          className="btn btn--quiet label library__delete"
          onClick={() => {
            if (window.confirm(`Delete "${item.title}"? This can't be undone.`)) deleteLibraryItem(item.id);
          }}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

/* ---------- Add / edit form ---------- */

interface EditorProps {
  heading: string;
  initial?: LibraryItem;
  onSave: (values: { title: string; prompt: string; tags: string[] }) => void;
  onCancel: () => void;
}

function ItemEditor({ heading, initial, onSave, onCancel }: EditorProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [prompt, setPrompt] = useState(initial?.prompt ?? "");
  const [tags, setTags] = useState(initial?.tags.join(", ") ?? "");
  const canSave = prompt.trim() !== "";

  return (
    <div className="card library__item library__editor">
      <p className="label muted">{heading}</p>
      <label className="label faint field-label">
        Title
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Exam revision plan" />
      </label>
      <label className="label faint field-label">
        Prompt
        <textarea className="prompt-input" rows={6} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      </label>
      <label className="label faint field-label">
        Tags (comma separated)
        <input className="input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="study, exam" />
      </label>
      <div className="button-row">
        <button
          type="button"
          className="btn label"
          disabled={!canSave}
          onClick={() =>
            onSave({ title: title.trim() || suggestTitle(prompt), prompt: prompt.trim(), tags: parseTags(tags) })
          }
        >
          Save
        </button>
        <button type="button" className="btn btn--quiet label" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
