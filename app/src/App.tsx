import './App.css'
import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Tasks from './pages/Tasks'
import ViewTasks from './pages/ViewTasks'
import TaskTable, { TaskRow } from './components/TaskTable'
import { taskService } from './services/taskService'

function Home() {
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

  return (
    <div className='max-w-5xl mx-auto px-4 pt-18 pb-12 flex flex-col items-center text-center' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '80px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <h1 className='font-bold text-gray-100' style={{ fontSize: '40.5px' }}>Welcome to Your Personal Productivity Assistant, Eris.</h1>
        <p className='text-gray-300' style={{ fontSize: '22.5px' }}>
          Manage your tasks intelligently with AI-powered insights and natural language processing.
        </p>
      </div>
      {loading ? <p className='text-gray-300'>Loading tasks...</p> : <TaskTable tasks={tasks} />}
    </div>
  )
}

function App() {
  return (
    <div className='min-h-screen bg-[#0f172a] flex flex-col'>
      <Navbar />
      <main className='px-4 flex-1 flex justify-center items-start' style={{ paddingTop: '120px' }}>
        <div className='mx-auto max-w-6xl w-full py-10'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/tasks' element={<Tasks />} />
            <Route path='/view-tasks' element={<ViewTasks />} />
            <Route path='/schedule' element={<div className='text-center text-gray-600'>Schedule Planner - Coming Soon</div>} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App