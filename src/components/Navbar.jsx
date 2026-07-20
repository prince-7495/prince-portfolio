import { useState, useEffect } from 'react'
import './Navbar.css'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="banner">
      <nav className="navbar-inner" aria-label="Main navigation">
        <a href="#hero" className="navbar-logo" aria-label="Prince Vaghasiya home">
          <span className="logo-icon" aria-hidden="true">PV</span>
          <span className="logo-name">Prince Vaghasiya</span>
        </a>

        <ul className="navbar-links" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="nav-link">{link.label}</a>
            </li>
          ))}
        </ul>

        <a
          href="https://github.com/prince-7495"
          target="_blank"
          rel="noreferrer"
          className="navbar-cta"
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
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/prince-7495"
            target="_blank"
            rel="noreferrer"
            className="mobile-link mobile-cta"
          >
            GitHub ↗
          </a>
        </div>
      )}
    </header>
  )
}
