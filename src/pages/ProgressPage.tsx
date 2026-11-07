/*
  PROGRESS PAGE
  - big numbers: stages done, day streak, prompts sent
  - stage list with status
  - badges (earned / locked)
  - backup: export / import as a JSON file, and reset
*/
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PageHead } from "../components/layout/PageHead";
import { DotIcon } from "../components/ui/DotIcon";
import { DotProgress } from "../components/ui/DotProgress";
import { StatusDot } from "../components/ui/StatusDot";
import { BADGES } from "../content/badges";
import { STAGES, stageNum } from "../content/stages";
import { applyBackup, describeBackup, downloadBackup, readBackup } from "../storage/backup";
import { currentStreak, progress, resetProgress } from "../storage/progress";

export function ProgressPage() {
  const p = progress.use();
  const streak = currentStreak(p.activeDays);
  const done = (id: number) => p.completedStages.includes(id);

  return (
    <>
      <PageHead
        kicker="Progress"
        title="Progress"
        summary="How far you've come. Everything here lives in this browser, so export a backup if you switch devices."
      />

      {/* ---------- Big numbers ---------- */}
      <div className="stats">
        <Stat value={`${p.completedStages.length}/${STAGES.length}`} label="Stages done" />
        <Stat value={String(streak)} label="Day streak" hint={streak === 0 ? "Send a prompt today to start one" : undefined} />
        <Stat value={String(p.promptsSent)} label="Prompts sent" />
      </div>

      {/* ---------- Stages ---------- */}
      <section className="settings-section">
        <h2 className="section-title">
          <span className="section-title__num dot">01</span>
          <span className="label">Stages</span>
        </h2>
        <div className="card">
          <DotProgress total={STAGES.length} doneFlags={STAGES.map((s) => done(s.id))} />
          <ul className="stage-status">
            {STAGES.map((s) => (
              <li key={s.id}>
                <Link to={`/stage/${s.id}`} className="stage-status__row">
                  <span className="dot stage-status__num">{stageNum(s.id)}</span>
                  <span>{s.title}</span>
                  <span className="label">
                    {done(s.id) ? (
                      <span className="stage-status__done">
                        <StatusDot tone="on" /> Done
                      </span>
                    ) : s.status === "soon" ? (
                      <span className="faint">Soon</span>
                    ) : (
                      <span className="muted">To do</span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Badges ---------- */}
      <section className="settings-section">
        <h2 className="section-title">
          <span className="section-title__num dot">02</span>
          <span className="label">
            Badges · {Object.keys(p.badges).length}/{BADGES.length}
          </span>
        </h2>
        <div className="badges">
          {BADGES.map((b) => {
            const earned = p.badges[b.id];
            return (
              <div key={b.id} className={earned ? "card badge is-earned" : "card badge"}>
                <DotIcon rows={b.icon} lit={Boolean(earned)} />
                <div>
                  <p className="badge__title">{b.title}</p>
                  <p className="small muted">{b.description}</p>
                  <p className="label faint badge__status">
                    {earned ? `Earned ${new Date(earned).toLocaleDateString()}` : b.comingSoon ? "Coming soon" : "Locked"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- Backup ---------- */}
      <section className="settings-section">
        <h2 className="section-title">
          <span className="section-title__num dot">03</span>
          <span className="label">Backup</span>
        </h2>
        <BackupCard />
      </section>
    </>
  );
}

function Stat({ value, label, hint }: { value: string; label: string; hint?: string }) {
  return (
    <div className="card stat">
      <span className="stat__value dot">{value}</span>
      <span className="label muted">{label}</span>
      {hint && <span className="small faint">{hint}</span>}
    </div>
  );
}

function BackupCard() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ text: string; alert: boolean } | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    const check = readBackup(await file.text());
    if (fileInput.current) fileInput.current.value = ""; // allow choosing the same file again

    if (!check.ok) {
      setMessage({ text: check.message, alert: true });
      return;
    }
    const sure = window.confirm(
      `${describeBackup(check.backup)}\n\nImporting replaces your current progress, saved prompts and library in this browser. Continue?`,
    );
    if (!sure) return;
    applyBackup(check.backup);
    window.location.reload(); // reload so every part of the app reads the imported data
  }

  function handleReset() {
    const sure = window.confirm(
      "Reset your progress, streak and badges? Your library and saved answers stay. This can't be undone, so export a backup first if you might want it back.",
    );
    if (!sure) return;
    resetProgress();
    setMessage({ text: "Progress reset.", alert: false });
  }

  return (
    <div className="card">
      <p className="muted">
        Download your progress, badges, saved answers and library as a file, then import it on another browser or
        computer. <strong>Your Gemini key is never included</strong>, so the file is safe to keep or share.
      </p>
      <div className="button-row">
        <button
          type="button"
          className="btn label"
          onClick={() => {
            downloadBackup();
            setMessage({ text: "Backup downloaded. Check your Downloads folder.", alert: false });
          }}
        >
          Export backup
        </button>
        <button type="button" className="btn label" onClick={() => fileInput.current?.click()}>
          Import backup
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <button type="button" className="btn btn--quiet label" onClick={handleReset}>
          Reset progress
        </button>
      </div>
      {message && <p className={message.alert ? "notice notice--alert" : "notice"}>{message.text}</p>}
    </div>
  );
}
