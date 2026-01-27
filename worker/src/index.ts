import { aiService } from './ai/aiService'
import { CommandParserDO } from './durable-objects/CommandParserDO'

interface Env {
  DB: D1Database
  AI: any
  COMMAND_PARSER: DurableObjectNamespace
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  })

const notFound = () => new Response('Not Found', { status: 404, headers: corsHeaders })

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

    const url = new URL(request.url)
    const path = url.pathname

    // Root ping
    if (path === '/') return new Response('Eris Worker is running', { status: 200, headers: corsHeaders })

    // ----- Tasks CRUD -----
    if (path === '/api/tasks' && request.method === 'GET') {
      const { results } = await env.DB.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all()
      return json(results)
    }

    if (path === '/api/tasks' && request.method === 'POST') {
      const body = (await request.json()) as any
      const id = crypto.randomUUID()
      const now = new Date().toISOString()
      await env.DB.prepare(
        `INSERT INTO tasks (id,title,description,priority,status,category,subcategory,due_date,estimated_duration,note,created_at,updated_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      )
        .bind(
          id,
          body.title ?? '',
          body.description ?? '',
          body.priority ?? 'medium',
          body.status ?? 'pending',
          body.category ?? 'work',
          body.subcategory ?? 'Courses',
          body.due_date ?? '',
          body.estimated_duration ?? 0,
          body.note ?? '',
          now,
          now,
        )
        .run()
      const task = await env.DB.prepare('SELECT * FROM tasks WHERE id = ?').bind(id).first()
      return json(task, 201)
    }

    if (path.match(/^\/api\/tasks\/[^/]+$/) && request.method === 'GET') {
      const id = path.split('/').pop()
      const task = await env.DB.prepare('SELECT * FROM tasks WHERE id = ?').bind(id).first()
      return task ? json(task) : json({ error: 'Task not found' }, 404)
    }

    if (path.match(/^\/api\/tasks\/[^/]+$/) && request.method === 'PUT') {
      const id = path.split('/').pop()
      const body = (await request.json()) as any
      const now = new Date().toISOString()
      await env.DB.prepare(
        `UPDATE tasks SET title=?,description=?,priority=?,status=?,category=?,subcategory=?,due_date=?,estimated_duration=?,note=?,updated_at=? WHERE id=?`,
      )
        .bind(
          body.title,
          body.description,
          body.priority,
          body.status,
          body.category,
          body.subcategory,
          body.due_date,
          body.estimated_duration,
          body.note,
          now,
          id,
        )
        .run()
      const task = await env.DB.prepare('SELECT * FROM tasks WHERE id = ?').bind(id).first()
      return task ? json(task) : json({ error: 'Task not found' }, 404)
    }

    if (path.match(/^\/api\/tasks\/[^/]+$/) && request.method === 'DELETE') {
      const id = path.split('/').pop()
      await env.DB.prepare('DELETE FROM tasks WHERE id = ?').bind(id).run()
      return json({ success: true })
    }

    // ----- AI Endpoints -----
    if (path === '/api/ai/parse-task' && request.method === 'POST') {
      const { input } = (await request.json()) as { input: string }
      const id = env.COMMAND_PARSER.idFromName('singleton')
      const stub = env.COMMAND_PARSER.get(id)
      const res = await stub.fetch('https://do/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      })
      return new Response(res.body, { status: res.status, headers: corsHeaders })
    }

    if (path === '/api/ai/suggest-priority' && request.method === 'POST') {
      const task = await request.json()
      const result = await aiService.suggestPriority(task, env)
      return json(result)
    }

    if (path === '/api/ai/estimate-duration' && request.method === 'POST') {
      const task = await request.json()
      const result = await aiService.estimateDuration(task, env)
      return json(result)
    }

    if (path === '/api/ai/categorize-task' && request.method === 'POST') {
      const task = await request.json()
      const result = await aiService.categorizeTask(task, env)
      return json(result)
    }

    return notFound()
  },
}

export { CommandParserDO }
