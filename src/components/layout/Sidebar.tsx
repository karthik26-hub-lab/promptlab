/*
  Left sidebar:
  - app name in dot font
  - the six stages as numbered dot-matrix entries
  - a dot progress row
  - links to Library / Progress / Settings, and the theme toggle
*/
import { NavLink, useLocation } from "react-router-dom";
import { APP_NAME, APP_TAGLINE } from "../../config";
import { STAGES, stageNum } from "../../content/stages";
import { DotProgress } from "../ui/DotProgress";
import { StatusDot } from "../ui/StatusDot";
import { ThemeToggle } from "./ThemeToggle";
import { useSettings, type KeyStatus } from "../../storage/settings";
import { currentStreak, progress } from "../../storage/progress";

const KEY_BADGE: Record<KeyStatus, string> = {
  none: "No key · add one",
  untested: "Key not tested",
  ok: "Gemini ready",
  bad: "Key not working",
};

export function Sidebar() {
  const { pathname } = useLocation();

  // Which stage is open right now (for the red dot in the progress row).
  const match = pathname.match(/^\/stage\/(\d+)/);
  const currentIndex = match ? Number(match[1]) - 1 : undefined;

  const { keyStatus } = useSettings();
  const { completedStages, activeDays } = progress.use();
  const completedCount = completedStages.length;
  const streak = currentStreak(activeDays);

  return (
    <aside className="sidebar">
      <NavLink to="/stage/1" className="sidebar__brand">
        <div className="sidebar__name dot">{APP_NAME}</div>
        <div className="sidebar__tagline label faint">{APP_TAGLINE}</div>
      </NavLink>

      <div className="sidebar__section-label label faint">Stages</div>
      <nav aria-label="Stages">
        <ol className="stage-list">
          {STAGES.map((stage) => (
            <li key={stage.id}>
              <NavLink
                to={`/stage/${stage.id}`}
                className={({ isActive }) =>
                  [
                    "stage-link",
                    isActive ? "is-active" : "",
                    stage.status === "soon" ? "is-soon" : "",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="stage-link__num dot">{stageNum(stage.id)}</span>
                    <span className="stage-link__title">{stage.short}</span>
                    {/* Right side: SOON, red dot (you're here), ✓ (done) or nothing */}
                    {stage.status === "soon" ? (
                      <span className="label faint">Soon</span>
                    ) : isActive ? (
                      <StatusDot />
                    ) : completedStages.includes(stage.id) ? (
                      <span className="label stage-link__done" aria-label="completed">
                        ✓
                      </span>
                    ) : (
                      <span />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ol>
      </nav>

      <div className="sidebar__progress">
        <DotProgress
          total={STAGES.length}
          doneFlags={STAGES.map((s) => completedStages.includes(s.id))}
          current={currentIndex}
          label={`${completedCount} of ${STAGES.length} stages complete`}
        />
        <NavLink to="/progress" className="label faint sidebar__stats">
          {completedCount}/{STAGES.length} complete
          {streak > 0 && ` · ${streak}-day streak`}
        </NavLink>
      </div>

      <div className="sidebar__footer">
        <NavLink to="/playground" className={({ isActive }) => `nav-link label ${isActive ? "is-active" : ""}`}>
          Playground <span aria-hidden="true">→</span>
        </NavLink>
        <NavLink to="/library" className={({ isActive }) => `nav-link label ${isActive ? "is-active" : ""}`}>
          Library <span aria-hidden="true">→</span>
        </NavLink>
        <NavLink to="/progress" className={({ isActive }) => `nav-link label ${isActive ? "is-active" : ""}`}>
          Progress <span aria-hidden="true">→</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-link label ${isActive ? "is-active" : ""}`}>
          Settings <span aria-hidden="true">→</span>
        </NavLink>
        {/* Key status: red dot until the learner has a working key */}
        <NavLink to="/settings" className="key-badge label">
          <StatusDot tone={keyStatus === "ok" ? "on" : "red"} />
          {KEY_BADGE[keyStatus]}
        </NavLink>
        <ThemeToggle />
      </div>
    </aside>
  );
}
