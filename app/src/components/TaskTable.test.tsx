import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TaskTable, { TaskRow } from './TaskTable'
import * as taskServiceModule from '../services/taskService'

vi.mock('../services/taskService')

const mockTasks: TaskRow[] = [
  {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    priority: 'high',
    status: 'pending',
    category: 'work',
    subcategory: 'Courses',
    dueDate: '2024-12-31',
    estimatedDuration: 60,
    note: 'Test note',
  },
]

describe('TaskTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders tasks correctly', () => {
    render(<TaskTable tasks={mockTasks} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('enters edit mode when Edit button clicked', async () => {
    render(<TaskTable tasks={mockTasks} />)
    const editButton = screen.getByText('Edit')
    fireEvent.click(editButton)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument()
      expect(screen.getByText('Save')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })
  })

  it('calls API when saving edits', async () => {
    const mockUpdate = vi.spyOn(taskServiceModule.taskService, 'update').mockResolvedValue({} as any)
    
    render(<TaskTable tasks={mockTasks} />)
    
    // Enter edit mode
    fireEvent.click(screen.getByText('Edit'))
    
    // Modify title
    const titleInput = screen.getByDisplayValue('Test Task')
    fireEvent.change(titleInput, { target: { value: 'Updated Task' } })
    
    // Save
    fireEvent.click(screen.getByText('Save'))
    
    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith('1', expect.objectContaining({
        title: 'Updated Task',
      }))
    })
  })

  it('cancels edit without saving', async () => {
    render(<TaskTable tasks={mockTasks} />)
    
    fireEvent.click(screen.getByText('Edit'))
    const titleInput = screen.getByDisplayValue('Test Task')
    fireEvent.change(titleInput, { target: { value: 'Should Not Save' } })
    
    fireEvent.click(screen.getByText('Cancel'))
    
    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument()
      expect(screen.queryByDisplayValue('Should Not Save')).not.toBeInTheDocument()
    })
  })

  it('deletes a task and updates UI', async () => {
    render(<TaskTable tasks={mockTasks} />)
    const deleteBtn = screen.getByText('Delete')
    fireEvent.click(deleteBtn)

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('1')
    })
    // after delete the row disappears
    await waitFor(() => {
      expect(screen.queryByText('Test Task')).not.toBeInTheDocument()
    })
  })
})
