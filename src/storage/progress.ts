/*
  PROGRESS: completed stages, badges, streak and a prompt counter.
  Everything is stored in this browser only ("promptlab:progress").

  Other parts of the app call the small "event" functions at the bottom:
    recordPromptSent()      after every successful Gemini answer
    recordSavedResult(id)   after a practice result is saved
    markStageComplete(id)   from the end-of-stage button
    recordLibrarySave()     after saving to the library
*/
import type { BadgeId } from "../content/badges";
import { createStore } from "./store";

export interface Progress {
  completedStages: number[];
  badges: Partial<Record<BadgeId, string>>; // badge → date earned (ISO)
  activeDays: string[];                    // "2026-11-08" for each day you did something
  promptsSent: number;
}

const INITIAL: Progress = { completedStages: [], badges: {}, activeDays: [], promptsSent: 0 };

export const progress = createStore<Progress>("progress", INITIAL);

/* ---------------- Dates and streak ---------------- */

/** Today's date as "YYYY-MM-DD" in the learner's own time zone. */
export function dayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Streak = how many days in a row you've been active.
 * If you haven't been active today yet, yesterday still counts,
 * so the streak doesn't look broken first thing in the morning.
 */
export function currentStreak(activeDays: string[]): number {
  const days = new Set(activeDays);
  const cursor = new Date();
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/* ---------------- Internal helpers ---------------- */

function withToday(p: Progress): Progress {
  const today = dayKey();
  return p.activeDays.includes(today) ? p : { ...p, activeDays: [...p.activeDays, today] };
}

function withBadge(p: Progress, id: BadgeId): Progress {
  return p.badges[id] ? p : { ...p, badges: { ...p.badges, [id]: new Date().toISOString() } };
}

/* ---------------- Events ---------------- */

export function recordPromptSent(): void {
  progress.update((p) => withBadge(withToday({ ...p, promptsSent: p.promptsSent + 1 }), "first-prompt"));
}

export function recordSavedResult(id: string): void {
  // "s3-improved" is the builder in Stage 3 (see content/stage3.ts).
  if (id === "s3-improved") progress.update((p) => withBadge(p, "first-improved"));
}

export function recordLibrarySave(): void {
  progress.update((p) => withBadge(withToday(p), "first-saved"));
}

export function markStageComplete(stageId: number): void {
  progress.update((p) => {
    if (p.completedStages.includes(stageId)) return p;
    let next: Progress = { ...p, completedStages: [...p.completedStages, stageId].sort((a, b) => a - b) };
    next = withBadge(withToday(next), "stage-complete");
    if ([1, 2, 3].every((s) => next.completedStages.includes(s))) next = withBadge(next, "foundations");
    return next;
  });
}

/** Start over (used by "Reset progress" on the Progress page). */
export function resetProgress(): void {
  progress.set(INITIAL);
}
