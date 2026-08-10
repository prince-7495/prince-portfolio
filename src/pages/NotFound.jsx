import { Link } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  return (
    <section className="section notfound" aria-labelledby="notfound-heading">
      <span className="section-label" aria-hidden="true">404</span>
      <h2 className="section-title" id="notfound-heading">Page Not Found</h2>
      <p className="section-sub">
        The route you are looking for doesn’t exist. Use the button below to go back to the homepage.
      </p>

      <Link to="/" className="btn-hero-primary" aria-label="Return home">
        Back to Home
      </Link>
    </section>
  )
}
