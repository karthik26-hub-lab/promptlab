/*
  PRACTICE BOX: write a prompt → send it to Gemini → see the answer.

  Options:
    saveAs       save prompt + answer under this id (and restore them on return)
    suggestions  tap-to-fill task ideas shown above the box
    initialPrompt text to start with
    onDone       called after a successful answer
*/
import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { useGenerate } from "../../ai/useGenerate";
import { saveResult, savedResults } from "../../storage/saved";
import { useSettings } from "../../storage/settings";
import { ResponseView } from "./ResponseView";
import { SendButton } from "./SendButton";
import { CopyButton } from "./CopyButton";
import { SaveToLibrary } from "./SaveToLibrary";

interface Props {
  saveAs?: string;
  suggestions?: string[];
  initialPrompt?: string;
  label?: string;
  placeholder?: string;
  onDone?: (prompt: string, answer: string) => void;
}

export function PracticeBox({
  saveAs,
  suggestions,
  initialPrompt = "",
  label = "Your prompt",
  placeholder = "Type your prompt here…",
  onDone,
}: Props) {
  const { apiKey } = useSettings();
  const ai = useGenerate();
  const inputId = useId();
  const [prompt, setPrompt] = useState(initialPrompt);

  // Coming back to a saved box? Show what the learner sent last time.
  const { restore } = ai;
  useEffect(() => {
    const saved = saveAs ? savedResults.get()[saveAs] : undefined;
    if (saved) {
      setPrompt(saved.prompt);
      restore(saved.result);
    }
  }, [saveAs, restore]);

  const loading = ai.state.status === "loading";
  const canSend = prompt.trim().length > 0 && !loading;

  async function send() {
    if (!canSend) return;
    const text = prompt.trim();
    const result = await ai.run(text);
    if (result.ok) {
      if (saveAs) saveResult(saveAs, text, result.text);
      onDone?.(text, result.text);
    }
  }

  // Ctrl+Enter (or Cmd+Enter on Mac) sends.
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="practice card">
      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="practice__suggestions">
          <span className="label faint">Need an idea? Tap one</span>
          <div className="chips">
            {suggestions.map((s) => (
              <button key={s} type="button" className="chip" onClick={() => setPrompt(s)} disabled={loading}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Prompt */}
      <div className="practice__head">
        <label className="label muted" htmlFor={inputId}>
          {label}
        </label>
        <span className="label faint">{prompt.length} chars</span>
      </div>
      <textarea
        id={inputId}
        className="prompt-input"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={5}
        disabled={loading}
        spellCheck
      />

      <div className="practice__actions">
        <SendButton onClick={send} loading={loading} disabled={!canSend} />
        {prompt && <CopyButton text={prompt} label="Copy prompt" />}
        {prompt && !loading && (
          <button
            type="button"
            className="btn btn--quiet label"
            onClick={() => {
              setPrompt("");
              ai.reset();
            }}
          >
            Clear
          </button>
        )}
        {prompt.trim() && !loading && <SaveToLibrary prompt={prompt.trim()} />}
        <span className="label faint practice__hint">Ctrl + Enter to send</span>
      </div>

      {!apiKey && (
        <p className="small muted practice__nokey">
          You need a free Gemini key to send.{" "}
          <Link to="/settings" className="link">
            Add it in Settings
          </Link>{" "}
          (about two minutes).
        </p>
      )}
      <p className="small faint practice__privacy">Don't type private information. On the free tier, Google may use prompts to improve its products.</p>

      <ResponseView state={ai.state} />
    </div>
  );
}
