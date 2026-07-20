import './Skills.css'

const SKILL_CATEGORIES = [
  {
    icon: '⚡',
    title: 'Languages',
    variant: '',
    skills: ['JavaScript', 'Python', 'Java', 'TypeScript', 'SQL', 'HTML / CSS'],
  },
  {
    icon: '🖥️',
    title: 'Frontend',
    variant: 'chip--purple',
    skills: ['React.js', 'Vite', 'Tailwind CSS', 'CSS Animations', 'Responsive Design'],
  },
  {
    icon: '🔧',
    title: 'Backend',
    variant: 'chip--green',
    skills: ['Node.js', 'Express.js', 'FastAPI', 'REST APIs', 'Supabase'],
  },
  {
    icon: '🤖',
    title: 'AI / ML',
    variant: 'chip--orange',
    skills: ['Machine Learning', 'NumPy', 'Pandas', 'Scikit-learn', 'Prompt Engineering'],
  },
  {
    icon: '🛠️',
    title: 'Tools & DevOps',
    variant: '',
    skills: ['Git', 'GitHub', 'Docker', 'VS Code', 'Postman', 'Linux'],
  },
  {
    icon: '🗄️',
    title: 'Databases',
    variant: 'chip--purple',
    skills: ['MySQL', 'PostgreSQL', 'Supabase', 'Firebase'],
  },
]

export default function Skills() {
  return (
    <section className="section skills" id="skills" aria-labelledby="skills-heading">
      <span className="section-label" aria-hidden="true">Skills</span>
      <h2 className="section-title" id="skills-heading">Technical Skills</h2>
      <p className="section-sub">
        Technologies and tools I work with across the full stack — from UI to AI.
      </p>

      <div className="skills-categories">
        {SKILL_CATEGORIES.map((cat) => (
          <article className="skill-category" key={cat.title}>
            <span className="cat-icon" aria-hidden="true">{cat.icon}</span>
            <h3 className="cat-title">{cat.title}</h3>
            <ul className="chip-list" role="list" aria-label={`${cat.title} skills`}>
              {cat.skills.map((skill) => (
                <li key={skill} className={`chip ${cat.variant}`} role="listitem">
                  {skill}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
