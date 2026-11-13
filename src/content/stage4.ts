import type { Stage } from "./types";
import { STUDY_HABIT_ARTICLE, STUDY_HABIT_TITLE } from "./articles/studyHabit";

/*
  STAGE 4 — Keywords & long context
  Part 1: which words steer the model (4 live one-word experiments).
  Part 2: how long context works + the instruction placement test ("s4-placement").
  Part 3: when to start a fresh chat, with a copyable carry-over summary prompt.
*/

export const stage4: Stage = {
  id: 4,
  title: "Keywords & long context",
  short: "Keywords & context",
  summary: "Which words steer the model, and what happens when the conversation gets long.",
  status: "ready",
  blocks: [
    /* ================= PART 1: words that steer ================= */
    {
      type: "section",
      title: "Words that steer",
      intro: "There are no magic words. But some words carry far more weight than others, and changing just one can change the whole answer.",
    },
    {
      type: "points",
      heading: "Five kinds of words to watch",
      items: [
        {
          title: "Action verbs",
          body: "Explain, list, compare, summarise, rewrite, critique. The verb decides what kind of answer you get.",
        },
        {
          title: "Format words",
          body: "Table, bullet points, steps, one paragraph, email, code only. They decide the shape.",
        },
        {
          title: "Tone words",
          body: "Friendly, formal, firm, casual, encouraging. They decide how it sounds.",
        },
        {
          title: "Limits",
          body: "Under 50 words, 3 points, one example, no jargon. They stop the answer from growing forever.",
        },
        {
          title: "Audience",
          body: "For a 10-year-old, for my professor, for a first-year student. They set the level.",
        },
      ],
    },
    {
      type: "text",
      body: [
        "Let's test it. Each experiment below sends the same prompt twice with just one thing changed. Press Run both and compare. (You can edit both prompts too.)",
      ],
    },
    {
      type: "experiment",
      heading: "01 · Change the verb",
      intro: "Explain asks for understanding. List asks for steps. Watch how the shape changes.",
      a: { label: "Explain", prompt: "Explain how UPI payments work." },
      b: { label: "List the steps", prompt: "List the steps of a UPI payment." },
    },
    {
      type: "experiment",
      heading: "02 · Add a format word",
      intro: "Same question, but the second one says what shape to use.",
      a: { label: "No format", prompt: "Compare Python and Java for a beginner." },
      b: { label: "In a table", prompt: "Compare Python and Java for a beginner in a table with 4 rows." },
    },
    {
      type: "experiment",
      heading: "03 · Name the audience",
      intro: "Who it's for changes the words, the examples and the depth.",
      a: { label: "No audience", prompt: "Explain recursion." },
      b: { label: "For a 10-year-old", prompt: "Explain recursion to a 10-year-old." },
    },
    {
      type: "experiment",
      heading: "04 · Set a limit",
      intro: "Without a limit, the model decides how much to write. Usually too much.",
      a: { label: "No limit", prompt: "Explain blockchain." },
      b: { label: "Under 50 words", prompt: "Explain blockchain in under 50 words." },
    },

    /* ================= PART 2: long context ================= */
    {
      type: "section",
      title: "How long context works",
      intro: "Why the AI 'forgets' things, and why where you put your instruction matters.",
    },
    {
      type: "text",
      body: [
        "Every time you send a message, the AI reads the whole conversation again from the top: your messages, its replies, anything you pasted. That's all it has. This is called its context window. It doesn't remember your other chats, and it can't see anything you didn't paste in.",
        "Context windows today are big, often hundreds of pages. But big doesn't mean everything gets equal attention. The longer the text, the easier it is for one small instruction to get lost.",
      ],
    },
    {
      type: "points",
      items: [
        {
          title: "Order matters",
          body: "The AI reads top to bottom. Instructions near the end, right before it starts writing, are usually followed more reliably.",
        },
        {
          title: "Instructions get buried",
          body: "Put one line of instruction above five pages of notes, and the notes can win, especially if they contain their own questions or headings.",
        },
        {
          title: "Long chats drift",
          body: "After many messages, early details fade. The AI may forget a rule you set at the start, or mix up versions of your work.",
        },
      ],
    },
    {
      type: "placement",
      heading: "Experiment: start or end?",
      intro:
        "Below is a 1,200-word article. Your instruction gets sent twice: once before the article, once after it. Notice the article ends with its own discussion questions. Does either answer get distracted by them, or ignore your format?",
      articleTitle: STUDY_HABIT_TITLE,
      article: STUDY_HABIT_ARTICLE,
      defaultInstruction: "Summarise this article in exactly 3 bullet points for a first-year student. Each bullet under 15 words.",
      saveAs: "s4-placement",
    },
    {
      type: "text",
      heading: "What to take from it",
      body: [
        "Sometimes the difference is big, sometimes both answers look fine. Modern models are getting better at this. But the risk grows with longer texts and longer chats, so the safe habit is simple: paste the material first, then put your instruction at the end. For really long material, say what you want at the start too, then repeat it at the end.",
      ],
    },
    {
      type: "reflection",
      id: "s4-reflection",
      heading: "What did you see?",
      after: "s4-placement",
      groups: [
        {
          question: "Which one followed your instruction better?",
          options: ["Instruction at the end", "Instruction at the start", "Both about the same"],
        },
        {
          question: "Did either answer…",
          options: ["Answer the discussion questions", "Ignore the 3-bullet limit", "Go over the word limit", "Neither, both were fine"],
        },
      ],
    },

    /* ================= PART 3: fresh chats ================= */
    {
      type: "section",
      title: "Start fresh, carry a summary",
      intro: "A new chat is free. Knowing when to start one is a skill.",
    },
    {
      type: "points",
      heading: "Start a new chat when…",
      items: [
        { title: "The topic changed", body: "Old messages about something else only add noise and can pull answers off track." },
        { title: "Answers are getting worse", body: "It repeats mistakes you already corrected, or forgets rules you set at the start." },
        { title: "It's very long", body: "Dozens of messages, big pasted files, many versions of the same work. Time for a clean slate." },
      ],
    },
    {
      type: "template",
      heading: "Carry over a short summary",
      intro: "Before leaving a long chat, ask for a summary, then paste it as the first message of the new chat. You keep what matters and lose the clutter.",
      text: "Summarise our conversation so far in 5 short bullet points that I can paste into a new chat:\n1. My goal\n2. Decisions we made\n3. Where things stand now\n4. Open questions\n5. The next step",
    },
    {
      type: "checkpoint",
      requires: "s4-placement",
      requiresText: "Run the start-or-end experiment above to complete this stage.",
      title: "Stage 04 done",
      text: "You know which words steer an answer, where to put instructions in long text, and when to start a fresh chat with a summary.",
    },
  ],
};
