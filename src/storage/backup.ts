/*
  EXPORT / IMPORT progress as a JSON file.

  What's included: progress, badges, saved results, reflections, builder drafts, library.
  What's NOT included: the Gemini key and settings. A backup file can be shared
  or emailed safely without leaking the key.
*/
import { readJSON, writeJSON } from "./local";
import { dayKey } from "./progress";

/** The localStorage keys (after "promptlab:") that go into a backup. */
const BACKUP_KEYS = ["progress", "saved", "reflections", "builderDrafts", "library"] as const;

const FORMAT_VERSION = 1;

interface BackupFile {
  app: "promptlab";
  version: number;
  exportedAt: string;
  data: Record<string, unknown>;
}

/** Build the backup and download it as promptlab-progress-YYYY-MM-DD.json */
export function downloadBackup(): void {
  const data: Record<string, unknown> = {};
  for (const key of BACKUP_KEYS) data[key] = readJSON<unknown>(key, null);

  const file: BackupFile = { app: "promptlab", version: FORMAT_VERSION, exportedAt: new Date().toISOString(), data };
  const blob = new Blob([JSON.stringify(file, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `promptlab-progress-${dayKey()}.json`; // local date, not UTC
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Check a backup file's text. Returns the parsed backup, or an error message
 * that can be shown to the learner as-is.
 */
export function readBackup(text: string): { ok: true; backup: BackupFile } | { ok: false; message: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, message: "That file isn't a PromptLab backup (it couldn't be read as JSON)." };
  }

  const b = parsed as Partial<BackupFile>;
  if (b?.app !== "promptlab" || typeof b.data !== "object" || b.data === null) {
    return { ok: false, message: "That file isn't a PromptLab backup." };
  }
  if (typeof b.version !== "number" || b.version > FORMAT_VERSION) {
    return { ok: false, message: "This backup is from a newer version of PromptLab. Update the app and try again." };
  }
  return { ok: true, backup: b as BackupFile };
}

/** Write a checked backup into localStorage. The page reloads afterwards so every store re-reads it. */
export function applyBackup(backup: BackupFile): void {
  for (const key of BACKUP_KEYS) {
    const value = backup.data[key];
    if (value !== undefined && value !== null) writeJSON(key, value);
  }
}

/** A short summary for the "are you sure?" question. */
export function describeBackup(backup: BackupFile): string {
  const progress = backup.data.progress as { completedStages?: unknown[] } | null;
  const library = backup.data.library as unknown[] | null;
  const stages = Array.isArray(progress?.completedStages) ? progress.completedStages.length : 0;
  const prompts = Array.isArray(library) ? library.length : 0;
  const date = new Date(backup.exportedAt).toLocaleDateString();
  return `Backup from ${date}: ${stages} stage(s) completed, ${prompts} saved prompt(s).`;
}
