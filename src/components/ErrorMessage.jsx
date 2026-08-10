import './ErrorMessage.css'

/**
 * ErrorMessage — displays a fetch error with a Retry button.
 *
 * Props:
 *   message  {string}    — the error text to display
 *   onRetry  {function}  — callback invoked when the user clicks Retry
 */
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-card" role="alert">
      <span className="error-icon" aria-hidden="true">⚠️</span>
      <h3 className="error-title">Something went wrong</h3>
      <p className="error-message">{message}</p>
      <button className="error-retry" onClick={onRetry}>
        ↺ Retry
      </button>
    </div>
  )
}
