import type { Stage } from "./types";

/*
  STAGE 2 — Try it yourself, no rules
  The learner writes a plain prompt the way they normally would, sends it live,
  and reflects on what was missing. No structure is taught here, on purpose.

  The prompt + answer are saved as "s2-first" and reused in Stage 3.
*/

export const stage2: Stage = {
  id: 2,
  title: "Try it yourself",
  short: "Try it, no rules",
  summary:
    "Write a prompt the way you normally would and send it to a real AI. No rules yet. The point is to notice what's missing.",
  status: "ready",
  blocks: [
    /* ================= PART 1: write and send ================= */
    {
      type: "section",
      title: "Your turn, no rules",
      intro: "Forget everything from Stage 1 for a minute. We want your normal, everyday prompt.",
    },
    {
      type: "text",
      body: [
        "Pick something you actually need help with this week: an assignment, an email, a plan, a topic you don't get. Or tap one of the ideas below.",
        "Write it the way you'd normally type into a chatbot. One or two lines is perfect. Don't try to be clever. Your first, plain prompt is the most useful thing for the next stage.",
      ],
    },
    {
      type: "practice",
      saveAs: "s2-first",
      suggestions: [
        "help me prepare for my DBMS exam",
        "write an email to my HOD asking for leave",
        "plan a weekend trip with friends",
        "explain how the internet works",
        "give me project ideas",
        "write a summary for my resume",
      ],
    },

    /* ================= PART 2: look at the answer ================= */
    {
      type: "section",
      title: "Look closely at the answer",
      intro: "Read it as if you had to actually use it today, not just whether it sounds good.",
    },
    {
      type: "text",
      body: [
        "Ask yourself: is this written for me, or for anyone who could have typed that? Did it guess things it couldn't know? Is it the right length and shape? Could I hand this in or send it right now?",
      ],
    },
    {
      type: "reflection",
      id: "s2-reflection",
      heading: "What did you notice?",
      after: "s2-first",
      groups: [
        {
          question: "What did you like?",
          options: [
            "It was fast",
            "Clear and easy to read",
            "Some useful ideas",
            "Seems correct",
            "Nothing really",
          ],
        },
        {
          question: "What was missing?",
          options: [
            "Too generic, not about me",
            "Too long",
            "Too short",
            "It guessed details",
            "Had [blanks] to fill in",
            "Wrong format",
            "Wrong level for me",
          ],
        },
      ],
      notePrompt: "Anything else you noticed? (optional)",
    },

    /* ================= PART 3: what usually happens ================= */
    {
      type: "section",
      title: "What most people notice",
      intro: "If your answer felt a bit 'meh', you're in good company. These come up almost every time.",
    },
    {
      type: "points",
      items: [
        {
          title: "It's written for anyone",
          body: "A short prompt could come from millions of people, so you get the safe, average answer that fits all of them a little and none of them well.",
        },
        {
          title: "It fills gaps with guesses",
          body: "Whatever you didn't say, it assumes: your level, your deadline, your budget, your tone. Sometimes it leaves [blanks] for you instead.",
        },
        {
          title: "The shape is random",
          body: "Too long, too short, a list when you wanted a paragraph. You never said what shape you wanted, so it picked one.",
        },
      ],
    },
    {
      type: "text",
      body: [
        "None of this means the AI is bad, or that you did it wrong. It means the AI didn't have enough to go on. It can only work with what's in the prompt.",
        "In Stage 3 you'll learn five simple building blocks and rebuild this exact prompt. Then you'll see both answers side by side.",
      ],
    },
    {
      type: "checkpoint",
      requires: "s2-first",
      requiresText: "Send your first prompt above to complete this stage.",
      title: "Stage 02 done",
      text: "You've sent your first prompt and noticed where it fell short. That's the most important skill in prompting: seeing what's missing. Your prompt is saved for the next stage.",
    },
  ],
};
