import { useState, useEffect, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthProvider, AuthContext } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import SkillsPage from './pages/SkillsPage'
import ProjectsPage from './pages/ProjectsPage'
import ContactPage from './pages/ContactPage'
import NotFound from './pages/NotFound'
import GithubRepos from './pages/GithubRepos'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
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

function AppContent() {
  const [theme, setTheme] = useState('light')
  const [activeTodoCount, setActiveTodoCount] = useState(loadActiveTodoCount)
  const { login, signup } = useAuth()

  // Stable callback so TodoPage's useEffect dependency never causes extra renders
  const handleTaskCountChange = useCallback((count) => {
    setActiveTodoCount(count)
  }, [])

  const handleLogin = useCallback((user, token) => {
    login(user, token)
  }, [login])

  const handleSignup = useCallback((user, token) => {
    signup(user, token)
  }, [signup])

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
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupPage onSignup={handleSignup} />} />
          <Route
            path="/todo"
            element={
              <ProtectedRoute>
                <TodoPage onTaskCountChange={handleTaskCountChange} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
