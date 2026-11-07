/*
  PLAYGROUND: free practice outside the lessons.
  Three modes: a single practice box, the prompt builder, or compare two prompts.
*/
import { useState } from "react";
import { PageHead } from "../components/layout/PageHead";
import { CompareRunner } from "../components/tools/CompareRunner";
import { PracticeBox } from "../components/tools/PracticeBox";
import { PromptBuilder } from "../components/tools/PromptBuilder";

type Mode = "single" | "builder" | "compare";

const MODES: { id: Mode; label: string }[] = [
  { id: "single", label: "Single prompt" },
  { id: "builder", label: "Builder" },
  { id: "compare", label: "Compare two" },
];

export function PlaygroundPage() {
  const [mode, setMode] = useState<Mode>("single");

  return (
    <>
      <PageHead
        kicker="Playground"
        title="Playground"
        summary="Try any prompt you like. Use Compare to change one thing and see what difference it makes."
      />

      <div className="segmented" role="tablist" aria-label="Playground mode">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={mode === m.id}
            className={mode === m.id ? "segmented__btn label is-active" : "segmented__btn label"}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Both stay mounted so switching tabs doesn't lose what you typed. */}
      <div hidden={mode !== "single"}>
        <PracticeBox saveAs="playground" />
      </div>
      <div hidden={mode !== "builder"}>
        <PromptBuilder saveAs="playground-builder" />
      </div>
      <div hidden={mode !== "compare"}>
        <CompareRunner
          labelA="Prompt A"
          labelB="Prompt B · change one thing"
          initialA="Explain black holes."
          initialB="Explain black holes to a 12-year-old in 3 short sentences, using one everyday comparison."
        />
      </div>
    </>
  );
}
