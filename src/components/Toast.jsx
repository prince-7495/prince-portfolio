import { useState, useEffect } from 'react'
import '../styles/Toast.css'

/**
 * Toast Notification Component
 * Displays success/error/info messages that auto-dismiss
 * 
 * Usage:
 *   <Toast message="Task created!" type="success" onDismiss={handleDismiss} />
 */
export default function Toast({ message, type = 'info', duration = 4000, onDismiss }) {
  const [isVisible, setIsVisible] = useState(!!message)

  useEffect(() => {
    if (!message) {
      setIsVisible(false)
      return
    }

    setIsVisible(true)

    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      setIsVisible(false)
      onDismiss?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [message, duration, onDismiss])

  if (!isVisible || !message) {
    return null
  }

  const typeClass = {
    success: 'toast--success',
    error: 'toast--error',
    info: 'toast--info',
    warning: 'toast--warning',
  }[type] || 'toast--info'

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  }[type] || 'ℹ'

  return (
    <div className={`toast ${typeClass}`} role="alert" aria-live="polite">
      <span className="toast__icon">{icon}</span>
      <span className="toast__message">{message}</span>
      <button
        className="toast__close"
        onClick={() => {
          setIsVisible(false)
          onDismiss?.()
        }}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  )
}
