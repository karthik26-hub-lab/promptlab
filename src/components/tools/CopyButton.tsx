/* Copies text to the clipboard and says "Copied" for a moment. */
import { useEffect, useState } from "react";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  // Go back to "Copy" after 1.5 seconds.
  useEffect(() => {
    if (state === "idle") return;
    const t = window.setTimeout(() => setState("idle"), 1500);
    return () => window.clearTimeout(t);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed"); // e.g. clipboard blocked by the browser
    }
  }

  return (
    <button type="button" className="btn btn--quiet label" onClick={copy} aria-live="polite">
      {state === "copied" ? "Copied ✓" : state === "failed" ? "Couldn't copy" : label}
    </button>
  );
}
