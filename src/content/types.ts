/*
  LESSON DATA FORMAT
  ------------------
  A Stage is a list of Blocks. The stage page draws each block in order,
  so to add or change a lesson you only edit the stageN.ts files.

  If you misspell a field or forget one, TypeScript underlines it
  in the editor before the app ever breaks.
*/

export type StageStatus = "ready" | "soon";

export interface Stage {
  id: number;          // 1–6, also the URL: /stage/1
  title: string;       // shown in dot font
  short: string;       // short title for the sidebar
  summary: string;     // one or two lines under the title
  status: StageStatus; // "soon" = shows as coming soon in the sidebar
  preview?: string[];  // for "soon" stages: what the stage will cover
  blocks: Block[];
}

/* ---------- Block types ---------- */

/** Starts a new part of the lesson, with a dotted line above it. Parts are numbered automatically. */
export interface SectionBlock {
  type: "section";
  title: string;
  intro?: string;
}

/** Shows how a model guesses the next word: a sentence + likely next words with dot bars. */
export interface NextWordBlock {
  type: "nextWord";
  heading?: string;
  stem: string; // the sentence so far
  options: { word: string; percent: number }[];
  note: string; // explanation under the chart
}

/** A few short key ideas shown as numbered cards. */
export interface PointsBlock {
  type: "points";
  heading?: string;
  items: { title: string; body: string }[];
}

/** Plain explanation: a heading and a few short paragraphs. */
export interface TextBlock {
  type: "text";
  heading?: string;
  body: string[]; // one string per paragraph
}

/** One building block explained with a real-life comparison, e.g. "briefing a new intern". */
export interface AnalogyBlock {
  type: "analogy";
  name: string;     // e.g. "Context"
  question: string; // e.g. "What does it need to know?"
  analogy: string;  // the real-life picture
  example: string;  // what it looks like in a prompt
  tip?: string;     // when to use it
}

/** A full prompt split into labelled parts (ROLE, TASK, …) to show its structure. */
export interface AnatomyBlock {
  type: "anatomy";
  heading?: string;
  parts: { label: string; text: string }[];
  note?: string;
}

/**
  Quick tour of things you can do: one tiny fixed example each.
  Results may use simple Markdown (lists, **bold**, `code`, tables, ``` code blocks).
*/
export interface TourBlock {
  type: "tour";
  heading?: string;
  items: { skill: string; prompt: string; result: string }[];
}

/** One fixed prompt + its pre-written result. */
export interface FixedExample {
  prompt: string;
  result: string;
}

/** Bad vs good prompt, side by side, with fixed results. */
export interface BeforeAfterBlock {
  type: "beforeAfter";
  task: string; // e.g. "Studying for an exam"
  bad: FixedExample;
  good: FixedExample;
  why: string;  // one or two lines on what made the difference
  added?: string[]; // short tags: what the good prompt added ("your deadline", "a format")
}

/** Live practice box. `saveAs` stores the prompt+result for later stages. */
export interface PracticeBlock {
  type: "practice";
  heading?: string;
  intro?: string;
  saveAs?: string;        // e.g. "s2-first" (reused in Stage 3)
  suggestions?: string[]; // tap-to-fill task ideas
  prefillFrom?: string;   // start the box with a saved prompt
}

/** Guided prompt builder (role, task, context, format, constraints, examples). */
export interface BuilderBlock {
  type: "builder";
  heading?: string;
  intro?: string;
  saveAs?: string;    // e.g. "s3-improved"
  reference?: string; // show this saved prompt above the builder (e.g. "s2-first") and start the Task with it
}

/** Compare two saved results (by their saveAs ids). */
export interface CompareBlock {
  type: "compare";
  heading?: string;
  left: { label: string; from: string };
  right: { label: string; from: string };
}

/** "What did you like? What was missing?" Tap-to-select options plus a free text box. */
export interface ReflectionBlock {
  type: "reflection";
  id: string;           // where the answers are saved
  heading?: string;
  after?: string;       // only unlock once this saved result exists (e.g. "s2-first")
  groups: { question: string; options: string[] }[];
  notePrompt?: string;  // label for the free text box
}

/** Stage 4 style experiment: same task, change one thing, compare. */
export interface ExperimentBlock {
  type: "experiment";
  heading: string;
  intro: string;
  a: { label: string; prompt: string };
  b: { label: string; prompt: string };
}

/**
  Instruction-placement test: the learner's instruction is sent twice,
  once BEFORE a long article and once AFTER it, and the answers are compared.
*/
export interface PlacementBlock {
  type: "placement";
  heading?: string;
  intro?: string;
  articleTitle: string;
  article: string;            // the long text (plain text or Markdown)
  defaultInstruction: string;
  saveAs: string;             // saved after a successful run (used to unlock the checkpoint)
}

/** A ready-made prompt the learner can copy. */
export interface TemplateBlock {
  type: "template";
  heading?: string;
  intro?: string;
  text: string;
}

/** End-of-stage box: a short wrap-up and the button to the next stage. */
export interface CheckpointBlock {
  type: "checkpoint";
  title?: string;
  text?: string;
  requires?: string;     // a saved result id that must exist before the stage can be completed
  requiresText?: string; // what to tell the learner while it's locked
}

export type Block =
  | SectionBlock
  | NextWordBlock
  | PointsBlock
  | TextBlock
  | AnalogyBlock
  | AnatomyBlock
  | TourBlock
  | BeforeAfterBlock
  | PracticeBlock
  | BuilderBlock
  | CompareBlock
  | ReflectionBlock
  | ExperimentBlock
  | PlacementBlock
  | TemplateBlock
  | CheckpointBlock;
