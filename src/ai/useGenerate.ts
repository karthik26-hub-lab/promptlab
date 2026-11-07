/*
  React hook around generate(): tracks loading / answer / error for one box.

    const ai = useGenerate();
    ai.run("my prompt");
    ai.state.status  → "idle" | "loading" | "done" | "error"
*/
import { useCallback, useEffect, useRef, useState } from "react";
import { generate, type AiResult } from "./gemini";
import { recordPromptSent } from "../storage/progress";

type Failure = Extract<AiResult, { ok: false }>;

export type GenerateState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; text: string; seconds: number }
  | { status: "error"; error: Failure };

export function useGenerate() {
  const [state, setState] = useState<GenerateState>({ status: "idle" });

  // If the learner leaves the page mid-request, don't update a component that's gone.
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(async (prompt: string): Promise<AiResult> => {
    setState({ status: "loading" });
    const started = performance.now();
    const result = await generate(prompt);
    const seconds = (performance.now() - started) / 1000;

    // Count it for progress (streak, "First prompt" badge), even if the learner left the page.
    if (result.ok) recordPromptSent();

    if (mounted.current) {
      setState(result.ok ? { status: "done", text: result.text, seconds } : { status: "error", error: result });
    }
    return result;
  }, []);

  /** Show an answer that was saved earlier (no API call). */
  const restore = useCallback((text: string) => setState({ status: "done", text, seconds: 0 }), []);
  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, run, restore, reset };
}
