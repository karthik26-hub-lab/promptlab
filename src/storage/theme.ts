/*
  Dark / light theme. Dark is the default.
  The choice is saved in localStorage and applied as <html data-theme="...">,
  which switches the colour tokens in styles/tokens.css.
*/
import { STORAGE_PREFIX } from "../config";

export type Theme = "dark" | "light";

const KEY = `${STORAGE_PREFIX}:theme`;

export function loadTheme(): Theme {
  try {
    return localStorage.getItem(KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark"; // storage blocked (private window etc.) → just use dark
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // ignore: theme still works for this visit
  }
}
