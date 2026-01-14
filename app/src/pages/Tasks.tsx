import { useState } from 'react'
import './Tasks.css'

interface Task {
  title: string
  description: string
  dueDate?: string
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in-progress' | 'done'
  category: 'course' | 'leetcode' | 'Internship' | 'Personal' | 'Household' | 'Miscellaneous'
}

function Tasks() {
  const [task, setTask] = useState<Task>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo',
    category: 'Personal',
  })
  const [submitted, setSubmitted] = useState<Task | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update<K extends keyof Task>(key: K, value: Task[K]) {
    setTask((t) => ({ ...t, [key]: value }))
  }

  function handleReset() {
    setTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'todo',
      category: 'Personal',
    })
    setSubmitted(null)
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!task.title.trim()) {
      setError('Please enter a task title')
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      // Dummy submit - just set submitted state
      setSubmitted(task)
      console.log('Task submitted:', task)
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='tasks-container'>
      <h1>Create a New Task</h1>
      
      <form onSubmit={handleSubmit} className='task-form'>
        {error && <div className='error-message'>{error}</div>}
        {submitted && (
          <div className='success-message'>
            ✓ Task created: {submitted.title}
          </div>
        )}

        <div className='form-group'>
          <label htmlFor='title'>Task Title *</label>
          <input
            id='title'
            type='text'
            value={task.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder='Enter task title'
            maxLength={100}
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='description'>Description</label>
          <textarea
            id='description'
            value={task.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder='Enter task description (optional)'
            rows={4}
            maxLength={500}
          />
        </div>

        <div className='form-row'>
          <div className='form-group'>
            <label htmlFor='dueDate'>Due Date</label>
            <input
              id='dueDate'
              type='date'
              value={task.dueDate || ''}
              onChange={(e) => update('dueDate', e.target.value)}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='priority'>Priority *</label>
            <select
              id='priority'
              value={task.priority}
              onChange={(e) => update('priority', e.target.value as 'low' | 'medium' | 'high')}
            >
              <option value='low'>Low</option>
              <option value='medium'>Medium</option>
              <option value='high'>High</option>
            </select>
          </div>
        </div>

        <div className='form-row'>
          <div className='form-group'>
            <label htmlFor='status'>Status *</label>
            <select
              id='status'
              value={task.status}
              onChange={(e) => update('status', e.target.value as 'todo' | 'in-progress' | 'done')}
            >
              <option value='todo'>To Do</option>
              <option value='in-progress'>In Progress</option>
              <option value='done'>Done</option>
            </select>
          </div>

          <div className='form-group'>
            <label htmlFor='category'>Category *</label>
            <select
              id='category'
              value={task.category}
              onChange={(e) => update('category', e.target.value as Task['category'])}
            >
              <option value='course'>Course</option>
              <option value='leetcode'>LeetCode</option>
              <option value='Internship'>Internship</option>
              <option value='Personal'>Personal</option>
              <option value='Household'>Household</option>
              <option value='Miscellaneous'>Miscellaneous</option>
            </select>
          </div>
        </div>

        <div className='form-actions'>
          <button
            type='submit'
            disabled={isSubmitting}
            className='btn btn-primary'
          >
            {isSubmitting ? 'Submitting...' : 'Create Task'}
          </button>
          <button
            type='button'
            onClick={handleReset}
            className='btn btn-secondary'
          >
            Reset
          </button>
        </div>
      </form>

      {submitted && (
        <div className='task-summary'>
          <h2>Task Summary</h2>
          <div className='summary-content'>
            <p><strong>Title:</strong> {submitted.title}</p>
            <p><strong>Description:</strong> {submitted.description || 'N/A'}</p>
            <p><strong>Due Date:</strong> {submitted.dueDate || 'N/A'}</p>
            <p><strong>Priority:</strong> <span className={`priority-badge priority-${submitted.priority}`}>{submitted.priority.toUpperCase()}</span></p>
            <p><strong>Status:</strong> <span className={`status-badge status-${submitted.status}`}>{submitted.status.replace('-', ' ').toUpperCase()}</span></p>
            <p><strong>Category:</strong> <span className={`category-badge category-${submitted.category}`}>{submitted.category}</span></p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Tasks