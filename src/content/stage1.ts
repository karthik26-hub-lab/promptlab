import type { Stage } from "./types";

/*
  STAGE 1 — What is a prompt?
  Fixed, pre-written examples only, so this stage works without an API key.

  Editing tips:
  - Results are written in simple Markdown (lists, **bold**, tables, code blocks).
  - Long results use `backtick strings` so line breaks are kept. Keep them flush left.
  - Inside a backtick string, write a code fence as \`\`\` (escaped).
*/

export const stage1: Stage = {
  id: 1,
  title: "What is a prompt?",
  short: "What is a prompt",
  summary:
    "What a chatbot actually does with your words, what you can use it for, and what a good prompt looks like next to a bad one.",
  status: "ready",
  blocks: [
    /* ================= PART 1: the idea ================= */
    {
      type: "section",
      title: "The short version",
      intro: "Five minutes of theory. No jargon, promise.",
    },
    {
      type: "text",
      body: [
        "A prompt is whatever you type into an AI chatbot: a question, an instruction, a paragraph you paste in, or all three together.",
        "That's it. There's no secret syntax. But the way you write it changes the answer a lot, and that's what this whole app is about.",
      ],
    },
    {
      type: "nextWord",
      heading: "What the model actually does",
      stem: "The best way to study for an exam is to",
      options: [
        { word: "practice", percent: 34 },
        { word: "start", percent: 22 },
        { word: "review", percent: 17 },
        { word: "make", percent: 9 },
        { word: "sleep", percent: 4 },
      ],
      note:
        "A chatbot is a model that predicts the next word. It reads all the text so far, guesses which word most likely comes next, adds it, and repeats, word by word, until the answer is done. (The numbers here are made up to show the idea.) It learned those guesses from a huge amount of text. So it is very good at sounding right, which is not the same as being right.",
    },
    {
      type: "points",
      heading: "Three things that follow from that",
      items: [
        {
          title: "It only knows what's in the conversation",
          body:
            "It can't see your syllabus, your professor's slides or what you had in mind. Unless the app gives it extra tools like web search or memory, it has only what it learned in training and the text in this chat. If it matters, put it in the prompt.",
        },
        {
          title: "It can be confidently wrong",
          body:
            "It predicts what sounds right, not what has been checked. Made-up facts, fake references and wrong maths can come out in the same confident tone as correct answers. Check anything important.",
        },
        {
          title: "Vague in, vague out",
          body:
            "A short, vague prompt gets the most 'average' answer, written for nobody in particular. The more you say about your situation and what you want back, the more the answer fits you.",
        },
      ],
    },

    /* ================= PART 2: tour ================= */
    {
      type: "section",
      title: "What you can do with a prompt",
      intro: "Way more than asking questions. Pick a skill to see a tiny example.",
    },
    {
      type: "tour",
      items: [
        {
          skill: "Explain",
          prompt: "Explain what an API is in two sentences, for someone who has never coded.",
          result:
            "An API is like a waiter in a restaurant: you (one app) tell the waiter what you want, and the waiter brings it back from the kitchen (another app) without you needing to know how the kitchen works. For example, when a weather app shows today's forecast, it's asking a weather service's API for the data.",
        },
        {
          skill: "Summarize",
          prompt:
            "Summarize this in 3 bullet points for a busy student:\n\n[pasted: a 2-page notice about the new attendance policy]",
          result: `- You now need **75% attendance per subject**, not overall, to sit the end-sem exam.
- Medical leave counts only if the certificate is submitted **within 7 days** of returning.
- Attendance is updated on the portal **every Friday**. Check it and report errors within a week.`,
        },
        {
          skill: "Write",
          prompt: "Write a 2-line LinkedIn caption for a photo of my team after winning a college hackathon. Not cringe.",
          result:
            "36 hours, too much coffee and one bug we fixed at 4 a.m. Proud of this team for taking first place at HackFest 2026. 🏆",
        },
        {
          skill: "Rewrite",
          prompt:
            'Make this message to my group sound polite but firm:\n"guys nobody has done their part and its due tomorrow"',
          result:
            "Hey everyone, just a reminder that the project is due tomorrow and a few sections are still empty. Can you each post your part here by 8 p.m. tonight so we have time to put it together? Thanks!",
        },
        {
          skill: "Translate",
          prompt: 'Translate to Hindi, keep it casual: "Running 10 minutes late, start without me."',
          result: "10 minute late ho raha hoon, mere bina shuru kar do. (१० मिनट लेट हो रहा हूँ, मेरे बिना शुरू कर दो।)",
        },
        {
          skill: "Plan",
          prompt: "I have 2 weeks to learn basic SQL for an internship interview. Make a plan, 1 hour a day.",
          result: `**Week 1: the basics**
- Days 1–2: SELECT, WHERE, ORDER BY
- Days 3–4: GROUP BY, COUNT, SUM, AVG
- Days 5–7: JOINs (inner and left), with 10 practice questions

**Week 2: interview mode**
- Days 8–10: subqueries and CASE
- Days 11–13: 5 timed practice problems a day
- Day 14: revise your mistakes and explain 3 queries out loud`,
        },
        {
          skill: "Brainstorm",
          prompt: "Give me 5 mini-project ideas for a 2nd-year CS student that are not a to-do app.",
          result: `1. A canteen menu app that shows what's left in real time
2. A bot that reminds your class group about assignment deadlines
3. A "split the bill" tool for trips with friends
4. A tracker that shows which classes you can still skip safely
5. A mock-interview timer that asks random questions from a list`,
        },
        {
          skill: "Quiz me",
          prompt: "Quiz me on photosynthesis with 3 multiple-choice questions. Don't show the answers until I reply.",
          result: `**1.** Where in the plant cell does photosynthesis happen?
a) Mitochondria b) Chloroplast c) Nucleus d) Ribosome

**2.** Which gas do plants take in for photosynthesis?
a) Oxygen b) Nitrogen c) Carbon dioxide d) Hydrogen

**3.** What is the main sugar made?
a) Glucose b) Sucrose c) Lactose d) Fructose

Reply with your answers (like 1b, 2c, 3a) and I'll check them.`,
        },
        {
          skill: "Compare",
          prompt: "Compare a laptop with 8 GB vs 16 GB RAM for a CS student. Short table.",
          result: `| | 8 GB | 16 GB |
|---|---|---|
| Coding + browser | Fine | Smooth |
| Android Studio / VMs | Slow | Comfortable |
| Price | Lower | ~₹5–10k more |
| Lasts | 2–3 years | 4+ years |`,
        },
        {
          skill: "Review code",
          prompt: `Why does this Python print the wrong average?\n\nmarks = [80, 90, 70]\navg = sum(marks) / len(marks) - 1\nprint(avg)`,
          result: `Order of operations: Python divides first, then subtracts 1, so you get 80 − 1 = **79**.

If you meant to divide by (count − 1), add brackets:

\`\`\`python
avg = sum(marks) / (len(marks) - 1)
\`\`\`

But for a normal average you don't need the - 1 at all:

\`\`\`python
avg = sum(marks) / len(marks)  # 80.0
\`\`\``,
        },
      ],
    },

    /* ================= PART 3: before & after ================= */
    {
      type: "section",
      title: "Before and after",
      intro:
        "Same task, same chatbot, two prompts. Read the bad one first, then the good one, then compare the answers.",
    },

    // ---- Pair 1: studying for an exam ----
    {
      type: "beforeAfter",
      task: "Studying for an exam",
      bad: {
        prompt: "help me study for my exam",
        result: `Of course! Here are some effective study tips:

1. **Make a study schedule.** Break your syllabus into manageable chunks.
2. **Use active recall.** Test yourself instead of just re-reading.
3. **Try the Pomodoro technique.** Study for 25 minutes, then take a 5-minute break.
4. **Teach someone else.** Explaining a topic helps you understand it.
5. **Get enough sleep.** Rest is essential for memory.

Good luck with your exam! Let me know if you'd like help with a specific subject.`,
      },
      good: {
        prompt:
          "I have a Data Structures exam in 4 days. Topics: arrays, linked lists, stacks, queues, trees and sorting. I'm fine with arrays and stacks but weak on trees and sorting. I can study 3 hours a day.\n\nMake a day-by-day plan as a table (day, topic, what to do, practice task). Spend more time on my weak topics and keep the last evening for revision.",
        result: `| Day | Topic | What to do | Practice task |
|---|---|---|---|
| 1 | Trees (part 1) | Binary trees, traversals: inorder, preorder, postorder | Write all 3 traversals by hand for one tree |
| 2 | Trees (part 2) + queues | BST insert, search, delete. Queue basics (1 hr) | Build a BST from 8 numbers, then delete 2 |
| 3 | Sorting | Bubble, insertion, merge, quick: how each works + time complexity | Sort one list with each method, step by step |
| 4 | Linked lists + revision | Insert/delete/reverse (1.5 hrs). Evening: revise all topics | Reverse a linked list. Do 1 past paper |

**Tip:** start each day with 10 minutes recalling yesterday's topic from memory, without your notes.`,
      },
      added: ["the subject", "your weak spots", "time you have", "a table format", "priorities"],
      why:
        "The first prompt could be from anyone, so it got advice for everyone. The second says which exam, what you already know, how much time you have and what shape the answer should take, so the plan is actually yours.",
    },

    // ---- Pair 2: writing an email ----
    {
      type: "beforeAfter",
      task: "Writing an email to a professor",
      bad: {
        prompt: "write an email to my professor asking for extension",
        result: `Subject: Request for Extension

Dear Professor [Last Name],

I hope this email finds you well. I am writing to respectfully request an extension on the [assignment name] that is due on [due date]. Unfortunately, due to [reason], I have been unable to complete the assignment to the best of my ability.

I truly value your course and want to submit work that reflects my understanding of the material. Would it be possible to extend the deadline to [new date]? I would be immensely grateful for your understanding and consideration.

Thank you very much for your time.

Sincerely,
[Your Name]`,
      },
      good: {
        prompt:
          "Write a short, polite email to my professor, Dr. Rao, asking for a 2-day extension on the Operating Systems assignment due this Friday. Reason: I've had a fever since Tuesday and have a doctor's note. I've finished about half of it.\n\nKeep it under 120 words, respectful but not over-apologetic, and include a subject line.",
        result: `**Subject:** OS assignment: request for a 2-day extension

Dear Dr. Rao,

I've been unwell with a fever since Tuesday and have a doctor's note, which I've attached. Because of this, I've only completed about half of the Operating Systems assignment due this Friday.

Could I please have a 2-day extension, until Sunday? I'm feeling better now and will be able to finish it properly by then.

Thank you for considering this.

Best regards,
Karan Mehta
Roll no. 22CS041`,
      },
      added: ["who it's to", "the real reason", "how much is done", "word limit", "tone"],
      why:
        "The vague prompt gave a template full of [blanks] and over-the-top politeness. Giving the real details meant there was nothing left to fill in, and asking for a word limit and tone kept it short and natural.",
    },

    // ---- Pair 3: planning a trip ----
    {
      type: "beforeAfter",
      task: "Planning a trip with friends",
      bad: {
        prompt: "plan a trip to goa",
        result: `Goa is a fantastic destination! Here's a 5-day itinerary:

**Day 1:** Arrive and check in to a beach resort. Relax at Calangute Beach.
**Day 2:** Visit Old Goa's churches, including the Basilica of Bom Jesus.
**Day 3:** Water sports at Baga Beach, followed by dinner at a seaside restaurant.
**Day 4:** Explore South Goa: Palolem Beach and a spice plantation tour.
**Day 5:** Shopping at Anjuna Flea Market before departure.

**Budget:** Costs vary depending on your choice of accommodation and activities.`,
      },
      good: {
        prompt:
          "Plan a 3-day trip to North Goa for 4 college friends in December. Budget: ₹6,000 per person including stay and food (train tickets from Pune are already booked). We like beaches, cheap local food and one night out. We don't care about museums or churches.\n\nGive a day-by-day plan with rough costs, then a budget breakdown per person.",
        result: `**Day 1:** Check in to a hostel near Anjuna (2 nights). Rent 2 scooters. Sunset at Vagator, dinner at a local fish thali place.
**Day 2:** Morning at Ashwem and Morjim (quieter beaches). Lunch at a beach shack. Night out at a club in Baga or Anjuna.
**Day 3:** Chapora Fort viewpoint early, then the Anjuna flea market if it's a Wednesday. Check out and head to the station.

**Budget per person (approx.)**
| Item | Cost |
|---|---|
| Hostel, 2 nights (December rates) | ₹1,800 |
| Scooter rental + petrol (shared) | ₹900 |
| Food, 3 days | ₹1,500 |
| Night out | ₹1,200 |
| Local travel + extras | ₹500 |
| **Total** | **₹5,900** |

December is peak season, so book the hostel early. Prices can double close to Christmas.`,
      },
      added: ["who's going", "budget", "what you like", "what to skip", "cost breakdown"],
      why:
        "The first answer planned a trip for a generic tourist with an unknown budget. Saying who you are, how much you can spend and what you don't care about cut out the useless parts and made the costs real.",
    },

    // ---- Pair 4: understanding a topic ----
    {
      type: "beforeAfter",
      task: "Understanding a topic",
      bad: {
        prompt: "explain recursion",
        result: `Recursion is a programming technique in which a function calls itself, directly or indirectly, in order to solve a problem. A recursive function typically consists of two parts:

1. **Base case:** the condition under which the function stops calling itself.
2. **Recursive case:** the part where the function calls itself with a modified argument, moving toward the base case.

Recursion is commonly used in algorithms such as tree traversal, divide-and-conquer approaches (e.g. merge sort, quicksort), dynamic programming, and backtracking. While recursion can lead to elegant solutions, it may also result in higher memory usage due to the call stack, and in some cases can cause stack overflow errors.`,
      },
      good: {
        prompt:
          "Explain recursion to me like I'm a first-year student who knows basic Python loops but has never understood recursion. Use one everyday analogy, then one tiny Python example with a line-by-line walk-through. Finish with the most common beginner mistake. Under 250 words.",
        result: `**The analogy:** you're in a long queue and want to know your position. You ask the person in front, "What's your number?" They ask the person in front of them, and so on, until the first person says "I'm 1." Then the answers come back: 2, 3, 4… until it reaches you.

Recursion is the same: a function solves a big problem by asking a **smaller copy of itself**, until it reaches a case so small it knows the answer.

\`\`\`python
def countdown(n):
    if n == 0:          # 1. the smallest case: stop here
        print("Go!")
        return
    print(n)            # 2. do a little work
    countdown(n - 1)    # 3. ask a smaller copy to do the rest

countdown(3)   # prints 3, 2, 1, Go!
\`\`\`

- **Line 2:** the "first person in the queue". When n is 0, stop.
- **Line 5:** handle this number.
- **Line 6:** hand the rest (n − 1) to another call.

**Most common mistake:** forgetting the stopping case, or never getting closer to it (like calling countdown(n) instead of countdown(n - 1)). The function then calls itself forever, and Python crashes with a RecursionError.`,
      },
      added: ["your level", "what you already know", "an analogy", "an example", "word limit"],
      why:
        "The first answer is a correct textbook definition that doesn't help if you didn't get it the first time. Saying what you already know and how you like to learn turned it into an explanation built for you.",
    },

    // ---- Pair 5: interview prep ----
    {
      type: "beforeAfter",
      task: "Preparing for an interview",
      bad: {
        prompt: "give me interview questions",
        result: `Here are some common interview questions:

1. Tell me about yourself.
2. What are your strengths and weaknesses?
3. Why do you want to work here?
4. Where do you see yourself in five years?
5. Describe a challenge you faced and how you overcame it.
6. Why should we hire you?
7. Do you have any questions for us?`,
      },
      good: {
        prompt:
          "I'm a 3rd-year CS student interviewing next week for a Python backend intern role at a small startup. My main project is a Flask app for booking college lab slots.\n\nGive me 6 likely questions: 3 technical (Python, APIs, SQL), 2 behavioural and 1 about my project. For each, add one line on what the interviewer is really checking. Don't write the answers. I want to try first.",
        result: `1. **What's the difference between a list and a tuple, and when would you use each?**
   Checking: Python basics and whether you think about why, not just what.
2. **What happens when your Flask app gets a GET request to /slots?**
   Checking: do you understand routes, requests and responses end to end?
3. **Write a SQL query to find which lab has the most bookings this week.**
   Checking: GROUP BY, COUNT, ORDER BY, and staying calm while writing a query live.
4. **Tell me about a time a teammate didn't do their part. What did you do?**
   Checking: communication and ownership, not blaming.
5. **What did you learn recently on your own, and how?**
   Checking: can you learn without being told to? Startups care about this a lot.
6. **How does your app stop two students from booking the same slot?**
   Checking: whether you understand your own project's edge cases.

When you're ready, send me your answer to any of these and I'll give feedback.`,
      },
      added: ["the role", "your background", "question types", "why each matters", "no answers yet"],
      why:
        "The vague prompt got the same list everyone gets. Describing the job and your project produced questions you might actually be asked, and \"don't write the answers\" turned it into practice instead of copying.",
    },

    /* ================= PART 4: wrap-up ================= */
    {
      type: "section",
      title: "What changed every time?",
      intro: "Look back at the five 'after' prompts. They all did the same few things.",
    },
    {
      type: "points",
      items: [
        { title: "A clear goal", body: "Not 'help with my exam' but 'a 4-day plan for my DS exam'." },
        { title: "Context about you", body: "Your level, your situation, what you already have or know." },
        { title: "A format", body: "A table, a subject line, bullet points, under 120 words…" },
        { title: "Sensible limits", body: "Budget, word count, what to skip, 'don't give the answers yet'." },
      ],
    },
    {
      type: "text",
      body: [
        "Notice that none of the good prompts used special words or tricks. They just gave the model what a smart friend would need to help you properly.",
        "Don't worry about memorising this. In the next stage you'll write your own prompt with no rules at all, on purpose, and see where it falls short.",
      ],
    },
    {
      type: "checkpoint",
      title: "Stage 01 done",
      text: "You know what a prompt is, what a model really does, and what makes a good prompt different from a bad one. Now it's your turn.",
    },
  ],
};
