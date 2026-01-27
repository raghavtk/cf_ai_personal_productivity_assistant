import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Tasks from './pages/Tasks'

function Home() {
  return (
    <div className='max-w-4xl mx-auto px-4 py-12 flex flex-col items-center text-center'>
      <h1 className='text-4xl font-bold text-gray-800'>
        Welcome to Your Personal Productivity Assistant
      </h1>
      <p className='text-xl text-gray-600'>
        Manage your tasks intelligently with AI-powered insights and natural language processing.
      </p>
      <div className='mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200'>
        <p className='text-gray-700'>
          Get started by creating your first task or using natural language to add tasks quickly.
        </p>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <main className='pt-20 px-4 flex justify-center'>
        <div className='mx-auto max-w-5xl w-full py-10'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/tasks' element={<Tasks />} />
            <Route path='/view-tasks' element={<div className='text-center text-gray-600'>View Tasks - Coming Soon</div>} />
            <Route path='/schedule' element={<div className='text-center text-gray-600'>Schedule Planner - Coming Soon</div>} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App