import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import Tasks from './pages/Tasks'

function Home() {
  return (
    <>
      <p className='read-the-docs'>
        Hello, this is a personal productivity assistant app. Go manage your tasks hehe.
      </p>
    </>
  )
}

function App() {
  return (
    <>
      <nav className='navbar'>
        <div className='nav-container'>
          <div className='nav-brand'>
            <span className='nav-title'>Personal Productivity Assistant</span>
          </div>
          <ul className='nav-links'>
            <li>
              <Link to='/' className='nav-link'>
                Home
              </Link>
            </li>
            <li>
              <Link to='/tasks' className='nav-link'>
                Create Task
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className='app-content'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/tasks' element={<Tasks />} />
        </Routes>
      </div>
    </>
  )
}

export default App