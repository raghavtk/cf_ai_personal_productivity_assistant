# Essential Prompts Documentation

This document contains key prompts used during the development of the Personal Productivity Assistant.

---

## AI Model Prompts for Workers AI

### 1. Natural Language Task Parser
**Model**: `@cf/meta/llama-3-8b-instruct` (or similar LLM)

## Project Progress (updated)
- Worker CRUD endpoints (`/api/tasks` GET/POST/PUT/DELETE) backed by D1.
- Durable Object `CommandParserDO` added for NL parsing context/history.
- AI endpoints deployed:
  - `/api/ai/parse-task` (DO + Workers AI)
  - `/api/ai/suggest-priority`
  - `/api/ai/estimate-duration`
  - `/api/ai/categorize-task`
- Frontend wired to Worker via `taskService`; inline edit/delete updates backend.
- Tests in Vitest cover service calls and TaskTable edit/delete flow.

