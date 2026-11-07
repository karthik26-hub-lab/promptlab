/*
  SETTINGS: the learner's Gemini key and model name.

  - Stored ONLY in this browser's localStorage ("promptlab:settings").
  - Never logged, never put in a URL, only sent to Google's Gemini API
    (see src/ai/gemini.ts).

  useSettings() lets any component read the settings and re-render
  when they change (e.g. the sidebar's "key ready" dot).
*/
import { useSyncExternalStore } from "react";
import { readJSON, writeJSON } from "./local";

/** Default model. Editable in Settings in case free-tier models change. */
export const DEFAULT_MODEL = "gemini-3.1-flash-lite";

/** none = no key, untested = saved but not checked, ok = test passed, bad = test failed */
export type KeyStatus = "none" | "untested" | "ok" | "bad";

export interface Settings {
  apiKey: string;
  model: string;
  keyStatus: KeyStatus;
}

const STORAGE_KEY = "settings";

const DEFAULTS: Settings = { apiKey: "", model: DEFAULT_MODEL, keyStatus: "none" };

// The current settings live in this variable; localStorage is the backup copy.
let current: Settings = { ...DEFAULTS, ...readJSON<Partial<Settings>>(STORAGE_KEY, {}) };

// Components that want to hear about changes.
const listeners = new Set<() => void>();

export function getSettings(): Settings {
  return current;
}

/** Change one or more settings, save them, and tell listeners. */
export function updateSettings(patch: Partial<Settings>): void {
  current = { ...current, ...patch };
  writeJSON(STORAGE_KEY, current);
  listeners.forEach((fn) => fn());
}

/** Save a new key (trimmed). A new key always starts as "untested". */
export function saveApiKey(key: string): void {
  const apiKey = key.trim();
  updateSettings({ apiKey, keyStatus: apiKey ? "untested" : "none" });
}

export function clearApiKey(): void {
  updateSettings({ apiKey: "", keyStatus: "none" });
}

/** React hook: returns the settings and re-renders when they change. */
export function useSettings(): Settings {
  return useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    getSettings,
  );
}
