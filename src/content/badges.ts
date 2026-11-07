/*
  BADGES. Edit titles and descriptions here.
  `icon` is a 5×5 dot-matrix picture: 5 rows of 5 characters, "1" = lit dot.
  When each badge is awarded is decided in src/storage/progress.ts.
*/

export type BadgeId =
  | "first-prompt"
  | "first-improved"
  | "stage-complete"
  | "foundations"
  | "first-saved"
  | "first-doctor";

export interface Badge {
  id: BadgeId;
  title: string;
  description: string;
  icon: string[]; // 5 rows × 5 dots
  comingSoon?: boolean; // can't be earned yet (its stage isn't built)
}

export const BADGES: Badge[] = [
  {
    id: "first-prompt",
    title: "First prompt",
    description: "Sent your first prompt to Gemini.",
    icon: ["00100", "00010", "11111", "00010", "00100"], // arrow
  },
  {
    id: "first-improved",
    title: "Glow-up",
    description: "Ran your first improved prompt in Stage 3.",
    icon: ["00100", "01110", "10101", "00100", "00100"], // up arrow
  },
  {
    id: "stage-complete",
    title: "Stage cleared",
    description: "Completed your first stage.",
    icon: ["00000", "00001", "00010", "10100", "01000"], // tick
  },
  {
    id: "foundations",
    title: "Foundations",
    description: "Completed stages 1, 2 and 3.",
    icon: ["00000", "00100", "01110", "11111", "00000"], // pyramid
  },
  {
    id: "first-saved",
    title: "Collector",
    description: "Saved your first prompt to the library.",
    icon: ["11111", "10001", "10001", "10101", "11011"], // bookmark
  },
  {
    id: "first-doctor",
    title: "Prompt Doctor",
    description: "Fixed your first weak prompt in Stage 5.",
    icon: ["00100", "00100", "11111", "00100", "00100"], // plus
    comingSoon: true,
  },
];

export function getBadge(id: BadgeId): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}
