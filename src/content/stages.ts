/*
  The six stages, in teaching order. Do not reorder:
  see it → try it → structure → keywords → judging → real use.
*/
import type { Stage } from "./types";
import { stage1 } from "./stage1";
import { stage2 } from "./stage2";
import { stage3 } from "./stage3";
import { stage4 } from "./stage4";
import { stage5 } from "./stage5";
import { stage6 } from "./stage6";

export const STAGES: Stage[] = [stage1, stage2, stage3, stage4, stage5, stage6];

export function getStage(id: number): Stage | undefined {
  return STAGES.find((s) => s.id === id);
}

/** "1" → "01", used everywhere a stage number is shown. */
export function stageNum(id: number): string {
  return String(id).padStart(2, "0");
}
