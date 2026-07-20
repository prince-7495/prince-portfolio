import './Projects.css'

const PROJECTS = [
  {
    icon: '🤖',
    tag: 'AI · Full Stack',
    title: 'AI Industrial Knowledge Platform',
    description:
      'A production-ready AI platform for industrial knowledge workflows. Built with React, FastAPI, and LLM integrations for prompt automation and scalable AI-assisted processes.',
    tech: ['React.js', 'FastAPI', 'Python', 'LLM'],
    link: 'https://github.com/prince-7495',
    demo: '',
    featured: true,
  },
  {
    icon: '🔍',
    tag: 'Machine Learning',
    title: 'ML Model Pipeline',
    description:
      'End-to-end machine learning pipeline for data ingestion, feature engineering, model training, and deployment. Designed for reproducibility and scalability.',
    tech: ['Python', 'Scikit-learn', 'Pandas', 'NumPy'],
    link: 'https://github.com/prince-7495',
    demo: '',
    featured: false,
  },
  {
    icon: '🌐',
    tag: 'Web App',
    title: 'Full-Stack Web Application',
    description:
      'A modern full-stack web application with React frontend, Node.js backend, and Supabase database. Includes authentication, real-time updates, and REST API.',
    tech: ['React.js', 'Node.js', 'Supabase', 'REST API'],
    link: 'https://github.com/prince-7495',
    demo: '',
    featured: false,
  },
  {
    icon: '📊',
    tag: 'Data Engineering',
    title: 'Data Analytics Dashboard',
    description:
      'Interactive dashboard for visualizing large datasets with filters, charts, and export features. Built for real-time data monitoring and reporting.',
    tech: ['React.js', 'Python', 'SQL', 'Charts'],
    link: 'https://github.com/prince-7495',
    demo: '',
    featured: false,
  },
]

export default function Projects() {
  return (
    <section className="section projects" id="projects" aria-labelledby="projects-heading">
      <span className="section-label" aria-hidden="true">Projects</span>
      <h2 className="section-title" id="projects-heading">Things I've Built</h2>
      <p className="section-sub">
        A selection of projects spanning AI, web development, and data engineering.
      </p>

      <div className="projects-grid">
        {PROJECTS.map((project) => (
          <article
            className={`project-card ${project.featured ? 'project-card--featured' : ''}`}
            key={project.title}
          >
            {project.featured && (
              <span className="featured-badge" aria-label="Featured project">⭐ Featured</span>
            )}
            <div className="project-top">
              <span className="project-icon" aria-hidden="true">{project.icon}</span>
              <span className="project-tag">{project.tag}</span>
            </div>
            <h3 className="project-title">{project.title}</h3>
            <p className="project-desc">{project.description}</p>

            <ul className="project-tech" aria-label="Technologies used" role="list">
              {project.tech.map((t) => (
                <li key={t} className="tech-tag" role="listitem">{t}</li>
              ))}
            </ul>

            <div className="project-actions">
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="project-link"
                aria-label={`View source code for ${project.title}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                Source Code
              </a>
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="project-link project-link--demo"
                  aria-label={`View live demo for ${project.title}`}
                >
                  Live Demo →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="projects-cta">
        <p>Want to see more work?</p>
        <a
          href="https://github.com/prince-7495"
          target="_blank"
          rel="noreferrer"
          className="btn-more"
          aria-label="View all projects on GitHub"
        >
          View All on GitHub →
        </a>
      </div>
    </section>
  )
}
