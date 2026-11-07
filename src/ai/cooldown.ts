/*
  COOLDOWN after a rate-limit error.

  When Google says "too many requests", gemini.ts calls startCooldown().
  Every Send / Test button uses useCooldown() to show a countdown and stay
  disabled until it reaches 0. The end time is saved, so refreshing the
  page doesn't skip the wait.
*/
import { useEffect, useState } from "react";
import { readJSON, writeJSON } from "../storage/local";

const STORAGE_KEY = "cooldownUntil";

let until: number = readJSON<number>(STORAGE_KEY, 0); // timestamp in ms
const listeners = new Set<() => void>();

export function startCooldown(seconds: number): void {
  until = Date.now() + seconds * 1000;
  writeJSON(STORAGE_KEY, until);
  listeners.forEach((fn) => fn());
}

/** Seconds left, rounded up. 0 means "you can send". */
export function cooldownLeft(): number {
  return Math.max(0, Math.ceil((until - Date.now()) / 1000));
}

/** React hook: seconds left, updated every second while counting down. */
export function useCooldown(): number {
  const [left, setLeft] = useState(cooldownLeft);

  useEffect(() => {
    const update = () => setLeft(cooldownLeft());
    listeners.add(update);
    const timer = window.setInterval(update, 1000);
    update();
    return () => {
      listeners.delete(update);
      window.clearInterval(timer);
    };
  }, []);

  return left;
}
