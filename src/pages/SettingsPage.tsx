/*
  SETTINGS PAGE
  01 Your key       — paste, save, test, remove
  02 Get a free key — step-by-step guide to Google AI Studio
  03 Model          — editable model name (in case free models change)
  04 Privacy        — where the key lives, and what not to type
*/
import { useState } from "react";
import { PageHead } from "../components/layout/PageHead";
import { DotLoader } from "../components/ui/DotLoader";
import { StatusDot } from "../components/ui/StatusDot";
import { testConnection } from "../ai/gemini";
import { useCooldown } from "../ai/cooldown";
import {
  DEFAULT_MODEL,
  clearApiKey,
  saveApiKey,
  updateSettings,
  useSettings,
  type KeyStatus,
} from "../storage/settings";

const AI_STUDIO_KEYS_URL = "https://aistudio.google.com/apikey";

/** Text shown next to the key, for each status. */
const STATUS_TEXT: Record<KeyStatus, string> = {
  none: "No key yet",
  untested: "Key saved · not tested",
  ok: "Key works",
  bad: "Key not working",
};

export function SettingsPage() {
  const settings = useSettings();
  const cooldown = useCooldown();

  // The text in the key box. Starts with the saved key (hidden by default).
  const [keyDraft, setKeyDraft] = useState(settings.apiKey);
  const [showKey, setShowKey] = useState(false);
  const [modelDraft, setModelDraft] = useState(settings.model);

  const [testing, setTesting] = useState(false);
  const [testMessage, setTestMessage] = useState("");

  const keyChanged = keyDraft.trim() !== settings.apiKey;
  const modelChanged = modelDraft.trim() !== settings.model;

  /** Save the key, then test it straight away. */
  async function handleSaveAndTest() {
    if (keyChanged) saveApiKey(keyDraft);
    await runTest();
  }

  async function runTest() {
    setTesting(true);
    setTestMessage("");
    const result = await testConnection();
    setTesting(false);

    if (result.ok) {
      updateSettings({ keyStatus: "ok" });
      setTestMessage(`Connected to ${result.text}. You're ready to practise.`);
    } else {
      // Only mark the key as bad if the key itself was the problem.
      if (result.kind === "invalid-key") updateSettings({ keyStatus: "bad" });
      setTestMessage(result.message);
    }
  }

  function handleRemoveKey() {
    if (!window.confirm("Remove your Gemini key from this browser?")) return;
    clearApiKey();
    setKeyDraft("");
    setTestMessage("");
  }

  function handleSaveModel() {
    const model = modelDraft.trim() || DEFAULT_MODEL;
    setModelDraft(model);
    // A new model hasn't been tested with this key yet.
    updateSettings({ model, keyStatus: settings.apiKey ? "untested" : "none" });
    setTestMessage("");
  }

  const hasKeyText = keyDraft.trim().length > 0;

  return (
    <>
      <PageHead
        kicker="Settings"
        title="Settings"
        summary="Add your own free Gemini key so the practice boxes can talk to the AI. Stage 1 works without one."
      />

      {/* ---------- 01 Your key ---------- */}
      <section className="settings-section">
        <SectionTitle num="01" title="Your Gemini key" />

        <div className="card">
          <label htmlFor="api-key" className="label muted field-label">
            API key
          </label>
          <div className="key-row">
            <input
              id="api-key"
              className="input input--mono"
              type={showKey ? "text" : "password"}
              value={keyDraft}
              onChange={(e) => setKeyDraft(e.target.value)}
              placeholder="Paste your key here"
              autoComplete="off"
              spellCheck={false}
            />
            <button type="button" className="btn label" onClick={() => setShowKey((s) => !s)}>
              {showKey ? "Hide" : "Show"}
            </button>
          </div>

          <div className="key-status">
            <span className="label key-status__state">
              <StatusDot tone={settings.keyStatus === "ok" ? "on" : "red"} />
              {STATUS_TEXT[settings.keyStatus]}
            </span>
          </div>

          <div className="button-row">
            <button
              type="button"
              className="btn btn--primary label"
              onClick={handleSaveAndTest}
              disabled={!hasKeyText || testing || cooldown > 0}
            >
              {cooldown > 0 ? `Wait ${cooldown}s` : keyChanged ? "Save & test key" : "Test key"}
            </button>
            {settings.apiKey && (
              <button type="button" className="btn btn--quiet label" onClick={handleRemoveKey}>
                Remove key
              </button>
            )}
          </div>

          {/* Result of the test */}
          {testing && <DotLoader label="Checking your key" />}
          {!testing && testMessage && (
            <p className={settings.keyStatus === "ok" ? "notice" : "notice notice--alert"} role="status">
              {testMessage}
            </p>
          )}
        </div>
      </section>

      {/* ---------- 02 How to get a key ---------- */}
      <section className="settings-section">
        <SectionTitle num="02" title="Get a free key" />
        <div className="card">
          <p className="muted">It's free and takes about two minutes. You only need a Google account.</p>
          <ol className="steps">
            <li>
              <span className="steps__num dot">1</span>
              <span>
                Open{" "}
                <a className="link" href={AI_STUDIO_KEYS_URL} target="_blank" rel="noopener noreferrer">
                  Google AI Studio → API keys
                </a>{" "}
                and sign in with your Google account.
              </span>
            </li>
            <li>
              <span className="steps__num dot">2</span>
              <span>If it asks you to accept the terms, read them and accept.</span>
            </li>
            <li>
              <span className="steps__num dot">3</span>
              <span>
                Click <strong>Create API key</strong>. If it asks for a project, the default one is fine.
              </span>
            </li>
            <li>
              <span className="steps__num dot">4</span>
              <span>Copy the key (a long string of letters and numbers) and paste it in the box above.</span>
            </li>
            <li>
              <span className="steps__num dot">5</span>
              <span>
                Press <strong>Save &amp; test key</strong>. When it says "Key works", you're ready.
              </span>
            </li>
          </ol>
          <p className="faint small">
            Treat the key like a password: don't post it online or share it with friends. If it leaks, delete it in AI
            Studio and make a new one.
          </p>
        </div>
      </section>

      {/* ---------- 03 Model ---------- */}
      <section className="settings-section">
        <SectionTitle num="03" title="Model" />
        <div className="card">
          <label htmlFor="model" className="label muted field-label">
            Model name
          </label>
          <div className="key-row">
            <input
              id="model"
              className="input input--mono"
              value={modelDraft}
              onChange={(e) => setModelDraft(e.target.value)}
              spellCheck={false}
            />
            <button type="button" className="btn label" onClick={handleSaveModel} disabled={!modelChanged}>
              Save
            </button>
          </div>
          <p className="muted small" style={{ marginTop: 12 }}>
            Default: <code>{DEFAULT_MODEL}</code>. You only need to change this if Google retires the model or the free
            limit runs out. Copy a new name from Google's models list, then test your key again.
          </p>
          {settings.model !== DEFAULT_MODEL && (
            <button
              type="button"
              className="btn btn--quiet label"
              onClick={() => {
                setModelDraft(DEFAULT_MODEL);
                updateSettings({ model: DEFAULT_MODEL, keyStatus: settings.apiKey ? "untested" : "none" });
              }}
            >
              Reset to default
            </button>
          )}
        </div>
      </section>

      {/* ---------- 04 Privacy ---------- */}
      <section className="settings-section">
        <SectionTitle num="04" title="Privacy" />
        <div className="card privacy">
          <p>
            <span className="label">Your key</span>
            Stays in this browser only. It's sent to Google's Gemini API and nowhere else. There are no accounts and no
            server.
          </p>
          <p>
            <span className="label">Your prompts</span>
            On the free tier, Google may use what you type to improve its products.{" "}
            <strong>Don't type private information</strong> into the practice boxes: no passwords, ID numbers, phone
            numbers or anything personal about other people.
          </p>
          <p>
            <span className="label">Shared computer?</span>
            Anyone using this browser can use your key. Press <strong>Remove key</strong> when you're done.
          </p>
        </div>
      </section>
    </>
  );
}

/** "01  YOUR GEMINI KEY" heading above each card. */
function SectionTitle({ num, title }: { num: string; title: string }) {
  return (
    <h2 className="section-title">
      <span className="section-title__num dot">{num}</span>
      <span className="label">{title}</span>
    </h2>
  );
}
