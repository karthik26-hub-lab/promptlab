/*
  REFLECTIONS: the learner's answers to "What did you like? What was missing?"
  Saved per reflection id (e.g. "s2-reflection").
*/
import { createStore } from "./store";

export interface Reflection {
  selected: string[]; // tapped options
  note: string;       // free text
}

export const reflections = createStore<Record<string, Reflection>>("reflections", {});

export function saveReflection(id: string, reflection: Reflection): void {
  reflections.update((all) => ({ ...all, [id]: reflection }));
}
