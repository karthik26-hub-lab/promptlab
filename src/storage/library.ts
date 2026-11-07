/*
  PROMPT LIBRARY: the learner's best prompts, with a title and tags.
  Stored in this browser only ("promptlab:library").
*/
import { createStore } from "./store";
import { recordLibrarySave } from "./progress";

export interface LibraryItem {
  id: string;
  title: string;
  prompt: string;
  tags: string[];
  createdAt: string; // ISO dates
  updatedAt: string;
}

export const library = createStore<LibraryItem[]>("library", []);

/** "Study, Email ,study" → ["study", "email"] */
export function parseTags(text: string): string[] {
  const tags = text
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  return [...new Set(tags)];
}

/** A default title: the first few words of the prompt. */
export function suggestTitle(prompt: string): string {
  const firstLine = prompt.trim().split("\n")[0];
  return firstLine.length > 48 ? firstLine.slice(0, 45).trimEnd() + "…" : firstLine;
}

function newId(): string {
  // Good enough for a local list: time + a little randomness.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function addToLibrary(input: { title: string; prompt: string; tags: string[] }): void {
  const now = new Date().toISOString();
  const item: LibraryItem = {
    id: newId(),
    title: input.title.trim() || suggestTitle(input.prompt),
    prompt: input.prompt,
    tags: input.tags,
    createdAt: now,
    updatedAt: now,
  };
  library.update((items) => [item, ...items]); // newest first
  recordLibrarySave();
}

export function updateLibraryItem(id: string, changes: Pick<LibraryItem, "title" | "prompt" | "tags">): void {
  library.update((items) =>
    items.map((it) => (it.id === id ? { ...it, ...changes, updatedAt: new Date().toISOString() } : it)),
  );
}

export function deleteLibraryItem(id: string): void {
  library.update((items) => items.filter((it) => it.id !== id));
}
