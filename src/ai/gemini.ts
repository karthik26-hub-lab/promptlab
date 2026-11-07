/*
  GEMINI CONNECTION. This is the ONLY file that talks to an AI provider.
  To switch model or provider later, change this file only.

  Two functions:
    generate(prompt)   → sends a prompt, returns the answer text
    testConnection()   → checks the saved key + model without using a prompt

  Neither one ever throws. They always return an AiResult:
    { ok: true,  text }
    { ok: false, kind, message, retryAfterSec? }
  `message` is friendly and ready to show to the learner as-is.

  Key safety:
    - the key is sent in the "x-goog-api-key" header, never in the URL
    - the key is never logged (there are no console.log calls in this file)
    - requests only go to generativelanguage.googleapis.com
*/
import { getSettings } from "../storage/settings";
import { cooldownLeft, startCooldown } from "./cooldown";

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const TIMEOUT_MS = 30_000;
const DEFAULT_WAIT_SEC = 60; // if Google doesn't say how long to wait

// The Send button shows the live countdown, so the message doesn't repeat the number.
const RATE_LIMIT_MESSAGE = "You've hit the free limit. Wait for the countdown on the button, then try again.";

export type AiErrorKind =
  | "no-key"       // learner hasn't added a key yet
  | "invalid-key"  // Google rejected the key
  | "bad-model"    // model name not found
  | "rate-limit"   // free limit hit → cooldown started
  | "offline"      // no internet / request never reached Google
  | "timeout"      // took too long
  | "blocked"      // Gemini refused to answer (safety)
  | "region"       // free tier not available where the learner is
  | "server"       // Google's side is busy or broken
  | "unknown";

export type AiResult =
  | { ok: true; text: string }
  | { ok: false; kind: AiErrorKind; message: string; retryAfterSec?: number };

/* ------------------------------------------------------------------ */
/* Public functions                                                    */
/* ------------------------------------------------------------------ */

/** Send one prompt to Gemini and get the answer text back. */
export async function generate(prompt: string): Promise<AiResult> {
  const { model } = getSettings();

  const response = await request(`/models/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    }),
  });
  if (!response.ok) return response;

  return readAnswer(response.data);
}

/**
 * Check that the key works and the model exists.
 * Asks Google for the model's info, which doesn't use up a prompt.
 */
export async function testConnection(): Promise<AiResult> {
  const { model } = getSettings();
  const response = await request(`/models/${encodeURIComponent(model)}`, { method: "GET" });
  if (!response.ok) return response;

  const name = (response.data as { displayName?: string }).displayName ?? model;
  return { ok: true, text: name };
}

/* ------------------------------------------------------------------ */
/* Internals                                                           */
/* ------------------------------------------------------------------ */

type RequestResult = { ok: true; data: unknown } | Extract<AiResult, { ok: false }>;

/** One HTTP call to Google with a timeout, turning every failure into a friendly result. */
async function request(path: string, init: { method: string; body?: string }): Promise<RequestResult> {
  const { apiKey, model } = getSettings();

  if (!apiKey) {
    return { ok: false, kind: "no-key", message: "Add your free Gemini key in Settings first. It takes about two minutes." };
  }

  // Still cooling down from a rate limit → don't even try.
  const wait = cooldownLeft();
  if (wait > 0) {
    return { ok: false, kind: "rate-limit", retryAfterSec: wait, message: RATE_LIMIT_MESSAGE };
  }

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(BASE_URL + path, {
      method: init.method,
      body: init.body,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      return { ok: false, kind: "timeout", message: "Gemini took too long to answer. Try again, or try a shorter prompt." };
    }
    return {
      ok: false,
      kind: "offline",
      message: navigator.onLine
        ? "Couldn't reach Gemini. Check your connection (or any ad blocker / firewall) and try again."
        : "You seem to be offline. Reconnect to the internet and try again.",
    };
  } finally {
    window.clearTimeout(timer);
  }

  // Google sends JSON for both answers and errors. Read it safely.
  const data: unknown = await res.json().catch(() => ({}));

  if (res.ok) return { ok: true, data };
  return explainError(res.status, data, model);
}

/** Shape of a Google API error body (only the parts we use). */
interface GoogleError {
  error?: {
    message?: string;
    status?: string;
    details?: { "@type"?: string; reason?: string; retryDelay?: string }[];
  };
}

/** Turn an HTTP error from Google into a friendly message. */
function explainError(status: number, data: unknown, model: string): Extract<AiResult, { ok: false }> {
  const err = (data as GoogleError).error ?? {};
  const msg = (err.message ?? "").toLowerCase();
  const reasons = (err.details ?? []).map((d) => d.reason ?? "");

  // Too many requests: start the cooldown.
  if (status === 429) {
    const retryInfo = (err.details ?? []).find((d) => d["@type"]?.endsWith("RetryInfo"));
    const seconds = Math.ceil(parseFloat(retryInfo?.retryDelay ?? "") || DEFAULT_WAIT_SEC);
    startCooldown(seconds);

    const daily = msg.includes("per day") || msg.includes("perday");
    return {
      ok: false,
      kind: "rate-limit",
      retryAfterSec: seconds,
      message: daily
        ? "You've used today's free requests for this model. Try again tomorrow, or switch to another model in Settings."
        : RATE_LIMIT_MESSAGE,
    };
  }

  // Bad or missing key.
  if (reasons.includes("API_KEY_INVALID") || status === 401 || status === 403 || msg.includes("api key")) {
    return {
      ok: false,
      kind: "invalid-key",
      message: "Google didn't accept this key. Check you copied all of it, or create a new one in AI Studio.",
    };
  }

  // Free tier not offered in the learner's country.
  if (msg.includes("location") || msg.includes("region")) {
    return { ok: false, kind: "region", message: "Gemini's free tier isn't available in your region yet." };
  }

  // Model name wrong or retired.
  if (status === 404) {
    return {
      ok: false,
      kind: "bad-model",
      message: `Google doesn't recognise the model "${model}". Check the model name in Settings.`,
    };
  }

  if (status >= 500) {
    return { ok: false, kind: "server", message: "Gemini is busy right now. Wait a few seconds and try again." };
  }

  return { ok: false, kind: "unknown", message: "Something went wrong talking to Gemini. Try again in a moment." };
}

/** Shape of a successful generateContent answer (only the parts we use). */
interface GenerateResponse {
  promptFeedback?: { blockReason?: string };
  candidates?: {
    finishReason?: string;
    content?: { parts?: { text?: string; thought?: boolean }[] };
  }[];
}

/** Pull the answer text out of Gemini's response. */
function readAnswer(data: unknown): AiResult {
  const body = data as GenerateResponse;

  if (body.promptFeedback?.blockReason) {
    return { ok: false, kind: "blocked", message: "Gemini declined to answer this prompt. Try rewording it." };
  }

  const candidate = body.candidates?.[0];
  // Skip "thought" parts (the model's private reasoning), keep the answer.
  const text = (candidate?.content?.parts ?? [])
    .filter((p) => !p.thought && p.text)
    .map((p) => p.text)
    .join("")
    .trim();

  if (text) return { ok: true, text };

  if (candidate?.finishReason === "SAFETY" || candidate?.finishReason === "PROHIBITED_CONTENT") {
    return { ok: false, kind: "blocked", message: "Gemini declined to answer this prompt. Try rewording it." };
  }
  return { ok: false, kind: "unknown", message: "Gemini sent back an empty answer. Try again." };
}
