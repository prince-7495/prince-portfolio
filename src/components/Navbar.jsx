import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Navbar.css'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Skills', to: '/skills' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/contact' },
  { label: 'GitHub Repos', to: '/repos' },
  { label: 'To-Do', to: '/todo' },
]

export default function Navbar({ theme, onToggleTheme, activeTodoCount = 0 }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleLogout() {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="banner">
      <nav className="navbar-inner" aria-label="Main navigation">
        <a href="#hero" className="navbar-logo" aria-label="Prince Vaghasiya home">
          <span className="logo-icon" aria-hidden="true">PV</span>
          <span className="logo-name">Prince Vaghasiya</span>
        </a>

        <ul className="navbar-links" role="list">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.to)
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`nav-link${isActive ? ' nav-link--active' : ''}`}
                >
                  {link.label}
                  {link.to === '/todo' && activeTodoCount > 0 && (
                    <span className="nav-badge" aria-label={`${activeTodoCount} active tasks`}>
                      {activeTodoCount}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        <button
          type="button"
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {isAuthenticated && user ? (
          <div className="navbar-user">
            <span className="navbar-user-name" title={user.name}>
              👤 {user.name}
            </span>
            <button
              className="navbar-logout-btn"
              onClick={handleLogout}
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="navbar-cta">
            Sign In
          </Link>
        )}

        <a
          href="https://github.com/prince-7495"
          target="_blank"
          rel="noreferrer"
          className="navbar-github"
          aria-label="View Prince's GitHub profile"
        >
          GitHub
        </a>

        <button
          className="burger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={`burger-bar ${menuOpen ? 'bar1-open' : ''}`} />
          <span className={`burger-bar ${menuOpen ? 'bar2-open' : ''}`} />
          <span className={`burger-bar ${menuOpen ? 'bar3-open' : ''}`} />
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu" role="navigation" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.to)
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`mobile-link${isActive ? ' mobile-link--active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
                {link.to === '/todo' && activeTodoCount > 0 && (
                  <span className="nav-badge" aria-label={`${activeTodoCount} active tasks`}>
                    {activeTodoCount}
                  </span>
                )}
              </Link>
            )
          })}
          
          {isAuthenticated && user ? (
            <>
              <div className="mobile-user-section">
                <span className="mobile-user-name">👤 {user.name}</span>
                <button
                  className="mobile-logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="mobile-link mobile-cta"
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
          
          <a
            href="https://github.com/prince-7495"
            target="_blank"
            rel="noreferrer"
            className="mobile-link mobile-github"
          >
            GitHub ↗
          </a>
        </div>
      )}
    </header>
  )
}
