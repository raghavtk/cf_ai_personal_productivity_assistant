# cf_ai_eris

Hello, this is a personal productivity assistant, Eris.

## Project Progress
- UI foundation: MUI AppBar, centered layout, dark themed task table.
- Task creation form: MUI-based with category/subcategory, priority/status, note (max 200), reset/save draft.
- D1 setup: Migration added for tasks, schedule entries, analytics aggregates, AI request logs; wrangler.toml configured with DB and AI bindings.
- Editable views: Home and View Tasks pages use inline-editable task table (including Note).
- Next up: Wire frontend to Worker CRUD endpoints and hydrate tables from D1.
- Named the assistant :D