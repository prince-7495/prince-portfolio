import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Toast from '../components/Toast'
import '../styles/AuthPages.css'

export default function SignupPage({ onSignup }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
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
    if (!formData.name.trim()) {
      setToast({ message: 'Name is required', type: 'warning' })
      return
    }
    if (formData.name.trim().length < 2) {
      setToast({ message: 'Name must be at least 2 characters', type: 'warning' })
      return
    }
    if (!formData.email.trim()) {
      setToast({ message: 'Email is required', type: 'warning' })
      return
    }
    if (!formData.password) {
      setToast({ message: 'Password is required', type: 'warning' })
      return
    }
    if (formData.password.length < 6) {
      setToast({ message: 'Password must be at least 6 characters', type: 'warning' })
      return
    }
    if (formData.password !== formData.passwordConfirm) {
      setToast({ message: 'Passwords do not match', type: 'warning' })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setToast({
          message: data.message || 'Signup failed',
          type: 'error',
        })
        return
      }

      // Save token and user
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('user', JSON.stringify(data.data.user))

      // Notify parent component
      onSignup?.(data.data.user, data.data.token)

      setToast({
        message: '✓ Account created successfully!',
        type: 'success',
      })

      // Redirect after short delay
      setTimeout(() => {
        navigate('/todo')
      }, 1000)
    } catch (error) {
      console.error('Signup error:', error)
      setToast({
        message: 'Network error. Please try again.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page" aria-labelledby="signup-heading">
      <div className="auth-container">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <h1 className="auth-title" id="signup-heading">
              Create Account
            </h1>
            <p className="auth-subtitle">
              Join us and start managing your tasks
            </p>
          </div>

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Name field */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>

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
              <small className="form-help">At least 6 characters</small>
            </div>

            {/* Confirm Password field */}
            <div className="form-group">
              <label htmlFor="passwordConfirm" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                className="form-input"
                placeholder="••••••••"
                value={formData.passwordConfirm}
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          {/* Login link */}
          <Link to="/login" className="auth-link">
            Sign in instead
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
