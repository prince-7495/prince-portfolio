import { useState, useEffect } from 'react'
import Spinner from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'
import './GithubRepos.css'

const GITHUB_API_URL = 'https://api.github.com/users/prince-7495/repos'

export default function GithubRepos() {
  const [repos, setRepos]       = useState([])      // holds the fetched repo array
  const [loading, setLoading]   = useState(true)    // true while the request is in-flight
  const [error, setError]       = useState(null)    // holds any fetch error message
  const [searchTerm, setSearch] = useState('')      // controlled input for filtering

  /**
   * fetchRepos is defined as a named function (not an inline arrow inside useEffect)
   * so that the ErrorMessage Retry button can call it directly to re-trigger the fetch
   * without unmounting/remounting the component.
   */
  function fetchRepos() {
    setLoading(true)
    setError(null)

    fetch(GITHUB_API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`)
        return res.json()
      })
      .then((data) => setRepos(data))
      .catch((err) => setError(err.message))
      /*
       * .finally() runs after BOTH success and failure paths, ensuring
       * loading is always set to false so the spinner never gets stuck.
       */
      .finally(() => setLoading(false))
  }

  /*
   * useEffect with an empty dependency array [] runs fetchRepos exactly once —
   * when the component first mounts. Without the empty array, the effect would
   * re-run after every render, causing an infinite loop of fetch → setState →
   * re-render → fetch again.
   */
  useEffect(() => {
    fetchRepos()
  }, [])

  /* ── Conditional rendering ── */
  if (loading) return <Spinner />
  if (error)   return <ErrorMessage message={error} onRetry={fetchRepos} />

  /* Filter repos by name (case-insensitive) against the current searchTerm */
  const filtered = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main className="repos-page" aria-labelledby="repos-heading">
      {/* Page header */}
      <div className="repos-header">
        <span className="section-label" aria-hidden="true">GitHub</span>
        <h1 className="section-title" id="repos-heading">My Repositories</h1>
        <p className="section-sub">
          Live from the GitHub API — automatically reflects any new repos I push.
          {repos.length > 0 && ` (${repos.length} total)`}
        </p>

        {/* Search / filter input */}
        <div className="repos-search-wrapper">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            className="repos-search"
            placeholder="Search repositories…"
            value={searchTerm}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search repositories by name"
          />
        </div>
      </div>

      {/* Repo grid */}
      {filtered.length === 0 ? (
        <p className="repos-empty">No repositories match "{searchTerm}".</p>
      ) : (
        <ul className="repos-grid" role="list">
          {filtered.map((repo) => (
            <li key={repo.id} className="repo-card" role="listitem">
              {/* Repo name */}
              <div className="repo-top">
                <span className="repo-icon" aria-hidden="true">📁</span>
                <h2 className="repo-name">{repo.name}</h2>
              </div>

              {/* Description — GitHub may return null */}
              {repo.description && (
                <p className="repo-desc">{repo.description}</p>
              )}

              {/* Footer row: language + stars + link */}
              <div className="repo-footer">
                {repo.language && (
                  <span className="repo-lang">{repo.language}</span>
                )}

                <span className="repo-stars" aria-label={`${repo.stargazers_count} stars`}>
                  {/* Star icon (SVG for crisp rendering at any size) */}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 .587l3.668 7.431 8.2 1.191-5.934 5.782 1.4 8.167L12 18.896l-7.334 3.862 1.4-8.167L.132 9.209l8.2-1.191z" />
                  </svg>
                  {repo.stargazers_count}
                </span>

                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="repo-link"
                  aria-label={`View ${repo.name} on GitHub`}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  View on GitHub
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
