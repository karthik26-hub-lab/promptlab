/*
  Turns the builder's labelled boxes into one plain prompt.
  Empty boxes are skipped. The result is ordinary text the learner
  can copy into any chatbot.
*/

export interface BuilderParts {
  role: string;
  task: string;
  context: string;
  format: string;
  constraints: string;
  examples: string;
}

export const EMPTY_PARTS: BuilderParts = {
  role: "",
  task: "",
  context: "",
  format: "",
  constraints: "",
  examples: "",
};

export function assemblePrompt(p: BuilderParts): string {
  const sections: string[] = [];

  // Role: "a patient tutor" → "You are a patient tutor."
  // If the learner already wrote "You are…" or "Act as…", keep their words.
  const role = p.role.trim();
  if (role) {
    const alreadySentence = /^(you are|you're|act as|pretend|imagine)/i.test(role);
    sections.push(alreadySentence ? role : `You are ${role.replace(/[.]$/, "")}.`);
  }

  if (p.task.trim()) sections.push(p.task.trim());
  if (p.context.trim()) sections.push(`Context:\n${p.context.trim()}`);
  if (p.format.trim()) sections.push(`Format:\n${p.format.trim()}`);
  if (p.constraints.trim()) sections.push(`Constraints:\n${p.constraints.trim()}`);
  if (p.examples.trim()) sections.push(`Here is an example of what I want:\n${p.examples.trim()}`);

  return sections.join("\n\n");
}

/** How many of the six boxes have something in them. */
export function filledCount(p: BuilderParts): number {
  return Object.values(p).filter((v) => v.trim() !== "").length;
}
