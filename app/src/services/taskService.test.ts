import { describe, it, expect, beforeEach, vi } from 'vitest'
import { taskService } from './taskService'

global.fetch = vi.fn()

describe('taskService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch all tasks', async () => {
    const mockTasks = [{ id: '1', title: 'Test', priority: 'high' }]
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTasks,
    })

    const result = await taskService.getAll()
    expect(result).toEqual(mockTasks)
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8787/api/tasks')
  })

  it('should create a task', async () => {
    const input = { title: 'New Task', priority: 'medium' } as any
    const mockTask = { id: '2', ...input }
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTask,
    })

    const result = await taskService.create(input)
    expect(result).toEqual(mockTask)
  })

  it('should update a task', async () => {
    const updated = { title: 'Updated' }
    const mockTask = { id: '1', ...updated }
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTask,
    })

    const result = await taskService.update('1', updated)
    expect(result.title).toBe('Updated')
  })

  it('should delete a task', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({ ok: true })
    await taskService.delete('123')
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8787/api/tasks/123', { method: 'DELETE' })
  })
})
