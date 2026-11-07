/*
  A small pop-up in the corner when a new badge is earned.
  It watches the progress store and compares the badge list with last time.
*/
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getBadge, type BadgeId } from "../../content/badges";
import { progress } from "../../storage/progress";
import { DotIcon } from "../ui/DotIcon";

export function BadgeToast() {
  const { badges } = progress.use();
  const known = useRef<Set<string> | null>(null);
  const [showing, setShowing] = useState<BadgeId | null>(null);

  useEffect(() => {
    const current = new Set(Object.keys(badges));
    // First run: remember what's already earned, don't announce old badges.
    if (known.current === null) {
      known.current = current;
      return;
    }
    const fresh = [...current].find((id) => !known.current!.has(id));
    known.current = current;
    if (fresh) setShowing(fresh as BadgeId);
  }, [badges]);

  // Hide after 5 seconds.
  useEffect(() => {
    if (!showing) return;
    const t = window.setTimeout(() => setShowing(null), 5000);
    return () => window.clearTimeout(t);
  }, [showing]);

  const badge = showing ? getBadge(showing) : undefined;
  if (!badge) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      <DotIcon rows={badge.icon} accent />
      <div>
        <p className="label toast__kicker">Badge unlocked</p>
        <p className="toast__title">{badge.title}</p>
        <Link to="/progress" className="label faint" onClick={() => setShowing(null)}>
          See all badges →
        </Link>
      </div>
      <button type="button" className="btn btn--quiet label toast__close" onClick={() => setShowing(null)} aria-label="Close">
        ×
      </button>
    </div>
  );
}
