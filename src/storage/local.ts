/*
  Tiny safe wrappers around localStorage.
  localStorage can throw (private windows, blocked storage, full disk),
  so every read and write goes through here and never crashes the app.
*/
import { STORAGE_PREFIX } from "../config";

const fullKey = (key: string) => `${STORAGE_PREFIX}:${key}`;

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(fullKey(key));
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(fullKey(key), JSON.stringify(value));
  } catch {
    // Storage unavailable: the app keeps working, it just won't remember.
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(fullKey(key));
  } catch {
    // ignore
  }
}
