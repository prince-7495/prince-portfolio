import { useState, useEffect, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import SkillsPage from './pages/SkillsPage'
import ProjectsPage from './pages/ProjectsPage'
import ContactPage from './pages/ContactPage'
import NotFound from './pages/NotFound'
import GithubRepos from './pages/GithubRepos'
import TodoPage from './pages/TodoPage'

const TODO_STORAGE_KEY = 'portfolio-todos'

/** Read active-task count directly from localStorage so the badge is correct on first render */
function loadActiveTodoCount() {
  try {
    const tasks = JSON.parse(localStorage.getItem(TODO_STORAGE_KEY)) || []
    return tasks.filter((t) => !t.completed).length
  } catch {
    return 0
  }
}

function App() {
  const [theme, setTheme] = useState('light')
  const [activeTodoCount, setActiveTodoCount] = useState(loadActiveTodoCount)

  // Stable callback so TodoPage's useEffect dependency never causes extra renders
  const handleTaskCountChange = useCallback((count) => {
    setActiveTodoCount(count)
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initialTheme = savedTheme || systemTheme
    setTheme(initialTheme)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

  return (
    <div className="app">
      <Navbar theme={theme} onToggleTheme={toggleTheme} activeTodoCount={activeTodoCount} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/repos" element={<GithubRepos />} />
          <Route path="/todo" element={<TodoPage onTaskCountChange={handleTaskCountChange} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
