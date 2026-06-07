# ADR 004 — AI Assistant Guardrails

**Date:** 2025-01-15
**Status:** Accepted

## Context

The portal embeds an AI assistant that answers buyer questions about their build project. The assistant must be helpful and grounded in real project data, while avoiding liability exposure from off-topic advice (legal, financial, medical).

## Decision

### Architecture
- All LLM calls are made server-side from `POST /api/ai/ask`
- The API key (`AI_API_KEY`) never reaches the browser
- The client sends `{ messages: AiMessage[], locale }` and receives a streaming SSE response
- The model and base URL are configurable via env vars (`AI_MODEL`, `AI_BASE_URL`) — supports OpenAI-compatible APIs

### System prompt grounding
The system prompt is built server-side from the buyer's project data (fetched from Prisma). It includes:
- Project name and unit
- Current build phase and progress %
- Advisor name and contact
- Explicit instruction to stay on-topic

This grounding is regenerated per request — it cannot be overridden by the client.

### Input sanitisation
User messages are sanitised before being forwarded:
- Strip "system:" prefixes (prompt injection)
- Strip "ignore previous instructions" patterns
- Truncate to 2000 characters
- Only the last 20 conversation turns are forwarded (context window management)

### Topic guardrails (system prompt instructions)
The system prompt explicitly instructs the model to:
- Decline questions about law, personal finance, health
- Redirect off-topic questions to the buyer's advisor
- Not invent facts about the project; say "I don't know, ask your advisor" when uncertain

### Rate limiting
- 20 requests per minute per authenticated session (TODO: implement via Upstash Redis)
- Unauthenticated requests are rejected with HTTP 401

### Audit logging
- All AI messages are stored in `AiMessage` table with `buyerId`, `role`, `content`, `createdAt`
- Logs are retained for 90 days for quality review
- Logs are NOT used for model training without explicit consent

## Consequences

- Streaming requires the `Content-Type: text/event-stream` response; the client must parse SSE chunks
- If `AI_API_KEY` is not set, the endpoint returns 503 — the UI should surface a friendly "AI not available" state
- Prompt injection is partially mitigated but not fully preventable; the server-side system prompt is the primary defence
- The guardrail instructions in the system prompt must be reviewed whenever the model is upgraded
