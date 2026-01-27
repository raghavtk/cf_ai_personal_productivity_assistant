# cf_ai_eris

Hello, this is a personal productivity assistant, Eris.

## Project Progress
- UI foundation: MUI AppBar, centered layout, dark themed task table.
- Task creation form: MUI-based with category/subcategory, priority/status, note (max 200), reset/save draft.
- D1 setup: Migration added for tasks, schedule entries, analytics aggregates, AI request logs; wrangler.toml configured with DB and AI bindings.
- Editable views: Home and View Tasks pages use inline-editable task table (including Note).
- Next up: Wire frontend to Worker CRUD endpoints and hydrate tables from D1.
- Named the assistant :D
- Worker CRUD live: `/api/tasks` supports GET/POST/PUT/DELETE backed by D1.
- Durable Object: `CommandParserDO` added for NL parsing context.
- AI endpoints live: `/api/ai/parse-task`, `/api/ai/suggest-priority`, `/api/ai/estimate-duration`, `/api/ai/categorize-task` using Workers AI (@cf/meta/llama-3-8b-instruct).
- Frontend services: `taskService` consumes Worker API; inline edits and deletion call backend.
- Tests: Vitest coverage for taskService and TaskTable edit/delete logic.