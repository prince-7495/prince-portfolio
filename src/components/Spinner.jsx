import './Spinner.css'

/**
 * Spinner — a simple animated loading indicator.
 * Rendered while the GitHub API fetch is in-flight.
 */
export default function Spinner() {
  return (
    <div className="spinner-wrapper" role="status" aria-label="Loading repositories">
      <div className="spinner" aria-hidden="true" />
      <p className="spinner-text">Fetching repositories…</p>
    </div>
  )
}
