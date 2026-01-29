import { useState, useEffect } from 'react'
import { Box, Container } from '@mui/material'
import TaskTable from '../components/TaskTable'
import type { TaskRow } from '../components/TaskTable'
import { taskService } from '../services/taskService'

const ViewTasks = () => {
  const [tasks, setTasks] = useState<TaskRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    taskService
      .getAll()
      .then((data) => {
        const mapped: TaskRow[] = data.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          priority: t.priority,
          status: t.status,
          category: t.category,
          subcategory: t.subcategory,
          dueDate: t.due_date,
          estimatedDuration: t.estimated_duration,
          note: t.note,
        }))
        setTasks(mapped)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleDeleted = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <Box sx={{ bgcolor: '#0f172a', minHeight: 'calc(100vh - 80px)', py: 4 }}>
      <Container maxWidth='lg'>
        {loading ? (
          <p style={{ color: '#e5e7eb', textAlign: 'center' }}>Loading tasks...</p>
        ) : (
          <TaskTable tasks={tasks} onDeleted={handleDeleted} />
        )}
      </Container>
    </Box>
  )
}

export default ViewTasks
