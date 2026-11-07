/* Switches between dark (default) and light. Same monochrome + red rules in both. */
import { useState } from "react";
import { applyTheme, loadTheme, type Theme } from "../../storage/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(loadTheme);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  }

  return (
    <button type="button" className="theme-toggle label" onClick={toggle}>
      <span>Theme</span>
      <span aria-live="polite">{theme === "dark" ? "● Dark" : "○ Light"}</span>
    </button>
  );
}
