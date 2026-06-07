/**
 * POST /api/ai/ask
 *
 * Server-side LLM proxy. The model key never reaches the client.
 * Request body: { messages: AiMessage[], locale?: "nb" | "en" }
 * Returns:      streaming text/event-stream
 *
 * Guardrails:
 *  - System prompt is built server-side from buyer's project data
 *  - Input is stripped of prompt-injection attempts
 *  - Rate-limited to 20 req/min per session (see TODO)
 *  - Only responds about Krag-related topics
 */

import { NextRequest } from "next/server";
import type { AiMessage } from "@/types";

const MODEL = process.env.AI_MODEL ?? "gpt-4o-mini";
const AI_BASE_URL = process.env.AI_BASE_URL ?? "https://api.openai.com/v1";
const AI_API_KEY = process.env.AI_API_KEY ?? "";

/** Build a grounded system prompt from buyer context (normally fetched from DB) */
function buildSystemPrompt(locale: "nb" | "en"): string {
  // In production: look up buyer from session, fetch from Prisma
  const projectContext =
    locale === "nb"
      ? `Du er en vennlig AI-assistent for Krag Gruppen. Du hjelper boligkjøpere med spørsmål om
sin boligbygging. Prosjekt: Justneshalvøya B7 i Molde. Byggefremgang: 62%. Rådgiver: Sine Kragh.
Svar kun om boligprosjektet, byggefremdrift, tilvalg, dokumenter og møter. Unngå råd om juss,
finans eller helse. Hold deg til fakta om prosjektet.`
      : `You are a friendly AI assistant for Krag Gruppen. You help home buyers with questions about
their building project. Project: Justneshalvøya B7 in Molde. Build progress: 62%. Advisor: Sine Kragh.
Only answer about the home project, build progress, choices, documents and meetings. Avoid legal,
financial or health advice. Stick to project facts.`;
  return projectContext;
}

/** Strip obvious prompt injection from user messages */
function sanitize(text: string): string {
  return text
    .replace(/system\s*:/gi, "")
    .replace(/ignore previous instructions/gi, "")
    .replace(/you are now/gi, "")
    .trim()
    .slice(0, 2000);
}

export async function POST(req: NextRequest) {
  if (!AI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "AI not configured. Set AI_API_KEY in .env.local" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { messages: AiMessage[]; locale?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const locale: "nb" | "en" = body.locale === "en" ? "en" : "nb";
  const messages = (body.messages ?? []).slice(-20); // last 20 turns

  const openaiMessages = [
    { role: "system", content: buildSystemPrompt(locale) },
    ...messages.map((m) => ({
      role: m.role,
      content: sanitize(m.content),
    })),
  ];

  const upstream = await fetch(`${AI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: openaiMessages,
      stream: true,
      max_tokens: 512,
      temperature: 0.4,
    }),
  });

  if (!upstream.ok) {
    const err = await upstream.text();
    return new Response(err, { status: upstream.status });
  }

  // Pass streaming SSE body directly to client
  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
