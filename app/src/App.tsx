import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Tasks from './pages/Tasks'
import ViewTasks from './pages/ViewTasks'
import TaskTable, { TaskRow } from './components/TaskTable'

const sampleTasks: TaskRow[] = [
  {
    id: '1',
    title: 'Finish project report',
    description: 'Complete the final draft for internship project',
    priority: 'high',
    status: 'pending',
    category: 'work',
    subcategory: 'Internship',
    dueDate: '2024-06-30',
    estimatedDuration: 120,
    note: 'Check data section',
  },
]

function Home() {
  return (
    <div className='max-w-5xl mx-auto px-4 py-12 flex flex-col items-center text-center space-y-8'>
      <div className='space-y-4'>
        <h1 className='text-4xl font-bold text-gray-800'>Welcome to Your Personal Productivity Assistant</h1>
        <p className='text-xl text-gray-600'>
          Manage your tasks intelligently with AI-powered insights and natural language processing.
        </p>
      </div>
      <TaskTable tasks={sampleTasks} />
    </div>
  )
}

function App() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <main className='pt-20 px-4 flex justify-center'>
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