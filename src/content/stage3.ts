import type { Stage } from "./types";

/*
  STAGE 3 — Structure
  Teaches the building blocks (role, task, context, format, constraints)
  plus examples, each with a real-life analogy. Then the learner rebuilds
  their Stage 2 prompt ("s2-first") in the builder ("s3-improved")
  and compares both answers.
*/

export const stage3: Stage = {
  id: 3,
  title: "Structure",
  short: "Structure",
  summary:
    "Five building blocks that turn a vague prompt into a clear brief. Then you'll rebuild your own Stage 2 prompt and compare.",
  status: "ready",
  blocks: [
    /* ================= PART 1: the building blocks ================= */
    {
      type: "section",
      title: "The building blocks",
      intro:
        "Think of a prompt as a brief you'd give a smart new intern on their first day. They're capable, but they know nothing about you. A good brief answers five questions.",
    },
    {
      type: "analogy",
      name: "Role",
      question: "Who's answering?",
      analogy:
        "Ask a doctor and a gym trainer \"how do I get fit?\" and you'll get two very different answers. Saying who should answer sets the knowledge, the tone and the level.",
      example: "You are a patient maths tutor who explains things to first-year engineering students.",
      tip: "Useful when expertise or tone matters. Skip it for quick factual questions.",
    },
    {
      type: "analogy",
      name: "Task",
      question: "What exactly do you want?",
      analogy:
        "At a restaurant you don't say \"food, please\". You name the dish. The task is the dish: one clear thing you want made.",
      example: "Make a 5-day revision plan for my Data Structures exam.",
      tip: "Start with an action verb: explain, list, compare, rewrite, summarise, plan. This is the only block you always need.",
    },
    {
      type: "analogy",
      name: "Context",
      question: "What does it need to know?",
      analogy:
        "A new intern is smart but knows nothing about your team. Five minutes of briefing saves a day of wrong work. The AI is that intern, in every single new chat.",
      example:
        "I'm in 2nd year CSE. The exam is in 5 days. I'm fine with arrays and stacks but weak on trees and graphs. I can study 3 hours a day.",
      tip: "Who you are, your situation, what you already know or tried, and what the answer is for.",
    },
    {
      type: "analogy",
      name: "Format",
      question: "What shape should the answer take?",
      analogy:
        "When you ask for directions, a map, a list of turns and \"just follow me\" are all correct, but only one is useful to you right now.",
      example: "Give it as a table with columns: day, topic, task. Then 3 tips as bullet points.",
      tip: "Table, bullet points, numbered steps, an email with a subject line, code only, one short paragraph…",
    },
    {
      type: "analogy",
      name: "Constraints",
      question: "What are the limits?",
      analogy:
        "A tailor needs your measurements and your budget. Without limits you get something beautiful that fits nobody.",
      example: "Under 200 words. Simple English. Spend most of the time on my weak topics.",
      tip: "Length, level, tone, budget, time, what to avoid, or \"ask me questions before you answer\".",
    },
    {
      type: "text",
      heading: "You don't need all five every time",
      body: [
        "A quick question needs only a task. A plan, an email or an explanation for you specifically needs more. Add a block when the answer would otherwise have to guess.",
        "Here's the full brief from the examples above, put together:",
      ],
    },
    {
      type: "anatomy",
      parts: [
        { label: "Role", text: "You are a patient Data Structures tutor for second-year students." },
        { label: "Task", text: "Make a 5-day revision plan for my exam." },
        { label: "Context", text: "I'm fine with arrays and stacks but weak on trees and graphs. I can study 3 hours a day." },
        { label: "Format", text: "A table with columns: day, topic, task. Then 3 tips as bullet points." },
        { label: "Constraints", text: "Spend most of the time on my weak topics. Keep the last day for revision. Under 200 words." },
      ],
      note: "Read it top to bottom: it's just a clear brief. No magic words, no special syntax.",
    },

    /* ================= PART 2: examples ================= */
    {
      type: "section",
      title: "Show, don't just tell",
      intro: "One more trick that works surprisingly well: give an example of what you want.",
    },
    {
      type: "analogy",
      name: "Examples",
      question: "Can you show it?",
      analogy:
        "At the barber, showing a photo works better than describing the haircut. One example says more than a paragraph of description.",
      example: 'Write it in this style:\n"Day 1 – Trees: watch one video on traversals, then solve 3 easy problems."',
      tip: "One or two samples are enough. Great for style, tone and fixed formats like captions, messages or flashcards.",
    },
    {
      type: "beforeAfter",
      task: "Captions in your club's style",
      bad: {
        prompt: "Write 3 Instagram captions for our college tech fest, Techno 2026.",
        result: `1. 🚀 Get ready for an unforgettable experience at **Techno 2026**! Join us for three days of innovation, competitions and fun. Don't miss out! #Techno2026 #TechFest #Innovation #CollegeLife

2. 💡 Where ideas come to life! Techno 2026 brings together the brightest minds for workshops, hackathons and more. Are you ready? #Techno2026 #FutureIsNow

3. 🎉 The countdown has begun! Mark your calendars for Techno 2026 and be part of something extraordinary. #Techno2026 #BeThere`,
      },
      good: {
        prompt:
          'Write 3 Instagram captions for our college tech fest, Techno 2026. Match the style of these two captions we used last year:\n\n"Robots. Pizza. Zero sleep. You in? 🤖"\n"Your code compiles? Prove it on stage. Hackathon, 14 Feb."\n\nShort, a bit funny, no hashtags.',
        result: `1. Drones up, phones out. Techno 2026 starts Friday. 🚁
2. Bring your laptop and your excuses. Only one survives the hackathon.
3. 48 hours. 30 events. One very tired student council. See you there.`,
      },
      added: ["two real samples", "length", "tone", "no hashtags"],
      why:
        "\"Make it fun\" is vague: fun to whom? Two real samples showed the length, rhythm and humour level all at once, so the new captions sound like your club, not like an ad.",
    },

    /* ================= PART 3: rebuild your prompt ================= */
    {
      type: "section",
      title: "Rebuild your first prompt",
      intro:
        "Now use the blocks on your own Stage 2 prompt. It's already in the Task box. Add whatever the first answer had to guess.",
    },
    {
      type: "text",
      body: [
        "Look back at what you said was missing in Stage 2. Too generic? Add context. Wrong shape? Add a format. Too long? Add a constraint. You don't need to fill every box.",
      ],
    },
    {
      type: "builder",
      saveAs: "s3-improved",
      reference: "s2-first",
    },
    {
      type: "compare",
      heading: "Before and after: your own prompts",
      left: { label: "Your first prompt (Stage 2)", from: "s2-first" },
      right: { label: "Your improved prompt", from: "s3-improved" },
    },
    {
      type: "reflection",
      id: "s3-reflection",
      heading: "What got better?",
      after: "s3-improved",
      groups: [
        {
          question: "Compared to your first answer, the new one is…",
          options: [
            "More about my situation",
            "A better format",
            "The right length",
            "The right level",
            "More useful overall",
            "Honestly, not much better",
          ],
        },
      ],
      notePrompt: "Which block made the biggest difference, and why?",
    },
    {
      type: "text",
      heading: "If it's not much better",
      body: [
        "That happens, and it's useful to notice. Usually the missing piece is context: the AI still had to guess something about you. Add one or two more details to Context and run it again. Small changes can make a big difference.",
      ],
    },
    {
      type: "checkpoint",
      requires: "s3-improved",
      requiresText: "Run your improved prompt in the builder above to complete this stage.",
      title: "Stage 03 done",
      text: "You can now write a clear brief: role, task, context, format, constraints, plus an example when style matters. You can use the builder any time from the Playground.",
    },
  ],
};
