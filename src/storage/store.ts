/*
  A tiny reusable "store": one value, saved in localStorage,
  that React components can read and re-render on change.

  Used for saved practice results now, and progress / library later.
*/
import { useSyncExternalStore } from "react";
import { readJSON, writeJSON } from "./local";

export interface Store<T> {
  get(): T;
  set(next: T): void;
  update(change: (current: T) => T): void;
  use(): T; // React hook
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function createStore<T>(storageKey: string, initial: T): Store<T> {
  let value: T = readJSON<T>(storageKey, initial);

  // If a newer version of the app adds fields, older saved data won't have them.
  // Fill the gaps from `initial` so the app never reads a missing field.
  if (isPlainObject(initial) && isPlainObject(value)) {
    value = { ...initial, ...value };
  } else if (isPlainObject(initial) !== isPlainObject(value)) {
    value = initial; // saved data has the wrong shape: start fresh
  }
  const listeners = new Set<() => void>();

  const set = (next: T) => {
    value = next;
    writeJSON(storageKey, value);
    listeners.forEach((fn) => fn());
  };

  return {
    get: () => value,
    set,
    update: (change) => set(change(value)),
    use: () =>
      useSyncExternalStore(
        (onChange) => {
          listeners.add(onChange);
          return () => listeners.delete(onChange);
        },
        () => value,
      ),
  };
}
