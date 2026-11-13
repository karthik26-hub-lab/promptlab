# PromptLab

A local web app that teaches complete beginners how to write good prompts for AI chatbots.
Built for college students (18–22) who use chatbots but don't know why some prompts work and others don't.

Pure front-end: React + Vite + TypeScript. No backend, no accounts. Each learner uses their own free
Gemini API key, which is stored only in their browser.

**Try it live: https://karthik26-hub-lab.github.io/promptlab/**

## Run it

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173), then go to **Settings** and add a free Gemini key.
Stage 1 works without a key.

Other commands:

| Command | What it does |
| --- | --- |
| `npm run build` | Type-checks, then builds the site into `dist/` |
| `npm run preview` | Serves the built `dist/` folder locally, to check the real build |

## The teaching flow

| Stage | Status | What happens |
| --- | --- | --- |
| 01 What is a prompt? | Ready | What a model really does, a 10-skill tour, 5 before/after pairs. Works offline, no key. |
| 02 Try it yourself | Ready | Learner sends their own plain prompt live, then reflects on what was missing. |
| 03 Structure | Ready | Role, task, context, format, constraints + examples. Rebuild the Stage 2 prompt in the builder and compare. |
| 04 Keywords & long context | Ready | 4 one-word experiments, how long context works, start-vs-end instruction test, carry-over summary template. |
| 05 Judging prompts | Coming soon | |
| 06 Real use & AI coding | Coming soon | |

Tools: Playground (single prompt, builder, compare two), Library, Progress (streak, badges, export/import).

## Where things live

| Folder / file | What it holds |
| --- | --- |
| `src/content/stage1.ts` … `stage6.ts` | **The lessons.** Edit these to change content; no UI code needed. |
| `src/content/types.ts` | Every block type a lesson can use, with comments. |
| `src/content/badges.ts` | Badge names, descriptions and dot-matrix icons. |
| `src/ai/gemini.ts` | The **only** file that talks to an AI provider. Swap model or provider here. |
| `src/ai/cooldown.ts` | The rate-limit countdown shared by every Send button. |
| `src/storage/` | Everything saved in localStorage: settings, progress, library, saved answers, backup. |
| `src/components/tools/` | Practice box, compare, prompt builder, save to library. |
| `src/components/lesson/` | How each lesson block is drawn. |
| `src/pages/` | One file per page. |
| `src/styles/tokens.css` | All colours, fonts and spacing. Monochrome + one red accent. |
| `src/config.ts` | App name and tagline (rename here and in `index.html`). |

## Adding or editing a lesson

1. Open the stage file, e.g. `src/content/stage4.ts`.
2. Add blocks to the `blocks` list, in the order they should appear. For example:

   ```ts
   { type: "section", title: "Words that steer", intro: "One word can change the whole answer." },
   { type: "text", body: ["First paragraph.", "Second paragraph."] },
   {
     type: "experiment",
     heading: "Change one word",
     intro: "Same request, different verb. Run both.",
     a: { label: "Explain", prompt: "Explain inflation." },
     b: { label: "Summarise", prompt: "Summarise inflation." },
   },
   ```

3. Set `status: "ready"` and remove `preview`.
4. Your editor underlines any mistake (a missing field, a misspelled type) before you even run the app.

Block types: `section`, `text`, `points`, `nextWord`, `tour`, `beforeAfter`, `analogy`, `anatomy`,
`practice`, `builder`, `compare`, `reflection`, `experiment`, `placement`, `template`, `checkpoint`. See `src/content/types.ts`.

## Privacy and the API key

- The key is saved only in the learner's browser (`localStorage`), never in the code, never logged.
- It is sent only to `generativelanguage.googleapis.com`, in a request header (not the URL).
- Backup files never include the key.
- On the free tier Google may use prompts to improve its products. The app reminds learners not to type
  private information.

## Hosting

Every push to `main` deploys automatically to GitHub Pages (see `.github/workflows/deploy.yml`).
The workflow builds with `BASE_PATH=/promptlab/` and copies `index.html` to `404.html` so links like
`/promptlab/stage/2` work on refresh. To host elsewhere (Netlify, Vercel), run `npm run build` and serve `dist/`,
sending every path to `index.html`.

## Ready for version 2

Out of scope for v1: accounts, online sync, payments, shared libraries, leaderboards.
The code is set up for them: all saved data goes through `src/storage/` (swap localStorage for a server there),
and the backup format has a version number.
