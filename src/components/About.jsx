import './About.css'
import '../App.css'

export default function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-heading">
      <span className="section-label" aria-hidden="true">About Me</span>
      <h2 className="section-title" id="about-heading">A little about Prince</h2>
      <p className="section-sub">
        Building at the intersection of AI, web, and real-world impact.
      </p>

      <div className="about-grid">
        <div className="about-card about-intro card-glass">
          <p className="about-intro-text">
            I'm a <span className="highlight-tag">B.Tech AI &amp; ML</span> student at{' '}
            <strong>CHARUSAT</strong>, Vadodara, with a deep interest in building products
            that solve real problems. I enjoy working across the full stack — from React
            frontends to backend APIs and AI integrations.
          </p>
          <p className="about-intro-text" style={{ marginTop: '12px' }}>
            When I'm not coding, I'm exploring new technologies, contributing to open-source,
            and levelling up my skills in machine learning and system design.
          </p>
        </div>

        <div className="about-card">
          <span className="about-card-icon" aria-hidden="true">🎓</span>
          <h3>Education</h3>

          <div className="about-item">
            <p className="about-item-title">Charotar University of Science &amp; Technology</p>
            <p className="about-item-meta">B.Tech — AI &amp; Machine Learning</p>
            <p className="about-item-desc">Currently pursuing. Focus on ML, deep learning, and software engineering.</p>
          </div>

          <div className="about-item">
            <p className="about-item-title">Parul Polytechnic Institute</p>
            <p className="about-item-meta">Diploma — Information Technology</p>
            <p className="about-item-desc">Strong foundation in programming, databases, and web development.</p>
          </div>
        </div>

        <div className="about-card">
          <span className="about-card-icon" aria-hidden="true">💼</span>
          <h3>Experience &amp; Focus</h3>

          <div className="about-item">
            <p className="about-item-title">Full-Stack Development</p>
            <p className="about-item-meta">React · Node.js · REST APIs</p>
            <p className="about-item-desc">Building end-to-end web applications with modern tooling and best practices.</p>
          </div>

          <div className="about-item">
            <p className="about-item-title">AI &amp; Machine Learning</p>
            <p className="about-item-meta">Python · ML Models · Data Engineering</p>
            <p className="about-item-desc">Designing and deploying intelligent systems for real-world applications.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
