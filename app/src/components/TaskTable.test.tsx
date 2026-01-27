import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TaskTable, { TaskRow } from './TaskTable'
import * as taskServiceModule from '../services/taskService'
import { aiService } from '../services/aiService'

vi.mock('../services/aiService')

const mockTasks: TaskRow[] = [
  {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    priority: 'high',
    status: 'pending',
    category: 'work',
    subcategory: 'Projects',
    dueDate: '',
    estimatedDuration: 30,
    note: 'note',
  },
]

describe('TaskTable selection + delete + AI actions', () => {
  beforeEach(() => vi.clearAllMocks())

  it('selects a row and deletes it', async () => {
    const mockDelete = vi.spyOn(taskServiceModule.taskService, 'delete').mockResolvedValue(undefined as any)
    render(<TaskTable tasks={mockTasks} />)
    fireEvent.click(screen.getByRole('checkbox')) // select all
    fireEvent.click(screen.getByText('Delete'))
    await waitFor(() => expect(mockDelete).toHaveBeenCalledWith('1'))
    await waitFor(() => expect(screen.queryByText('Test Task')).not.toBeInTheDocument())
  })

  it('runs estimate time on selected rows (calls AI)', async () => {
    ;(aiService.estimateDuration as any) = vi.fn().mockResolvedValue({ estimated_minutes: 30 })
    vi.spyOn(taskServiceModule.taskService, 'update').mockResolvedValue({} as any)

    render(<TaskTable tasks={mockTasks} />)
    fireEvent.click(screen.getByRole('checkbox')) // select all
    fireEvent.click(screen.getByText('Estimate Time'))

    await waitFor(() => {
      expect(aiService.estimateDuration).toHaveBeenCalled()
    })
  })
})
