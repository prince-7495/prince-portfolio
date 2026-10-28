import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Toast from '../components/Toast'
import '../styles/AuthPages.css'

export default function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ message: '', type: '' })
  const navigate = useNavigate()

  function handleInputChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // Validation
    if (!formData.email.trim()) {
      setToast({ message: 'Email is required', type: 'warning' })
      return
    }
    if (!formData.password) {
      setToast({ message: 'Password is required', type: 'warning' })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setToast({
          message: data.message || 'Login failed',
          type: 'error',
        })
        return
      }

      // Save token and user
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('user', JSON.stringify(data.data.user))

      // Notify parent component
      onLogin?.(data.data.user, data.data.token)

      setToast({
        message: '✓ Login successful!',
        type: 'success',
      })

      // Redirect after short delay
      setTimeout(() => {
        navigate('/todo')
      }, 1000)
    } catch (error) {
      console.error('Login error:', error)
      setToast({
        message: 'Network error. Please try again.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page" aria-labelledby="login-heading">
      <div className="auth-container">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <h1 className="auth-title" id="login-heading">
              Sign In
            </h1>
            <p className="auth-subtitle">
              Welcome back! Please login to your account
            </p>
          </div>

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Email field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
                aria-describedby="email-help"
                required
              />
            </div>

            {/* Password field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="auth-button"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>Don't have an account?</span>
          </div>

          {/* Signup link */}
          <Link to="/signup" className="auth-link">
            Create a new account
          </Link>

          {/* Footer */}
          <p className="auth-footer">
            <Link to="/" className="text-link">
              Back to home
            </Link>
          </p>
        </div>
      </div>

      {/* Toast notification */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast({ message: '', type: '' })}
          duration={toast.type === 'error' ? 4000 : 3000}
        />
      )}
    </main>
  )
}
