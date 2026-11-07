/*
  SAVED RESULTS: prompt + answer pairs that later steps reuse.
  Example: Stage 2 saves the learner's first prompt as "s2-first",
  and Stage 3 shows it next to their improved prompt.
*/
import { createStore } from "./store";
import { recordSavedResult } from "./progress";

export interface SavedResult {
  prompt: string;
  result: string;
  savedAt: string; // ISO date
}

/** All saved results, keyed by id (e.g. "s2-first"). */
export const savedResults = createStore<Record<string, SavedResult>>("saved", {});

export function saveResult(id: string, prompt: string, result: string): void {
  savedResults.update((all) => ({
    ...all,
    [id]: { prompt, result, savedAt: new Date().toISOString() },
  }));
  recordSavedResult(id); // may award a badge (e.g. the Stage 3 improved prompt)
}

/** React hook: one saved result (or undefined), updates when it changes. */
export function useSavedResult(id: string | undefined): SavedResult | undefined {
  const all = savedResults.use();
  return id ? all[id] : undefined;
}
