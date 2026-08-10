import { useState, useEffect, useRef } from 'react'

const STORAGE_KEY = 'portfolio-todos'

/** Read tasks from localStorage, falling back to an empty array */
function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

/** Persist tasks to localStorage */
function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

/** Returns true when a due-date string (YYYY-MM-DD) is today or in the past */
function isOverdue(dueDate) {
  if (!dueDate) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dueDate) <= today
}

// ─── Inline-edit sub-component ───────────────────────────────────────────────
function EditableTitle({ value, onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef(null)

  function startEdit() {
    setDraft(value)
    setEditing(true)
  }

  function commit() {
    const trimmed = draft.trim()
    if (trimmed) onSave(trimmed)
    setEditing(false)
  }

  // Focus the input as soon as it appears
  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  if (editing) {
    return (
      <input
        ref={inputRef}
        className="todo-edit-input"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}                        // save on click-away
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') setEditing(false)
        }}
        aria-label="Edit task title"
      />
    )
  }

  return (
    <span
      className="todo-title"
      onClick={startEdit}
      title="Click to edit"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && startEdit()}
    >
      {value}
    </span>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function TodoPage({ onTaskCountChange }) {
  const [tasks, setTasks]       = useState(loadTasks)
  const [input, setInput]       = useState('')
  const [dueDate, setDueDate]   = useState('')
  const [filter, setFilter]     = useState('all')  // 'all' | 'active' | 'completed'

  // Drag state — track which id is being dragged and which id we're hovering over
  const [dragId, setDragId]       = useState(null)
  const [dragOverId, setDragOverId] = useState(null)

  // Sync to localStorage and notify parent (Navbar badge) on every tasks change
  useEffect(() => {
    saveTasks(tasks)
    const activeCount = tasks.filter((t) => !t.completed).length
    onTaskCountChange?.(activeCount)
  }, [tasks, onTaskCountChange])

  // ── CRUD helpers ────────────────────────────────────────────────────────────
  function addTask(e) {
    e.preventDefault()
    const title = input.trim()
    if (!title) return
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), title, completed: false, dueDate: dueDate || null },
    ])
    setInput('')
    setDueDate('')
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function editTitle(id, newTitle) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
    )
  }

  function clearCompleted() {
    setTasks((prev) => prev.filter((t) => !t.completed))
  }

  // ── Drag-and-drop ────────────────────────────────────────────────────────────
  function handleDragStart(id) {
    setDragId(id)
  }

  function handleDragOver(e, id) {
    e.preventDefault()           // required to allow drop
    setDragOverId(id)
  }

  function handleDrop(e, targetId) {
    e.preventDefault()
    if (dragId === targetId) return

    setTasks((prev) => {
      const from = prev.findIndex((t) => t.id === dragId)
      const to   = prev.findIndex((t) => t.id === targetId)
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
    setDragId(null)
    setDragOverId(null)
  }

  function handleDragEnd() {
    setDragId(null)
    setDragOverId(null)
  }

  // ── Filtered view ────────────────────────────────────────────────────────────
  const visible = tasks.filter((t) => {
    if (filter === 'active')    return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const activeCount    = tasks.filter((t) => !t.completed).length
  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <main className="todo-page" aria-labelledby="todo-heading">
      <div className="todo-container">
        {/* Header */}
        <div className="todo-header">
          <span className="section-label" aria-hidden="true">Productivity</span>
          <h1 className="section-title" id="todo-heading">To-Do List</h1>
          <p className="section-sub">
            {activeCount} task{activeCount !== 1 ? 's' : ''} remaining
          </p>
        </div>

        {/* Add-task form */}
        <form className="todo-form" onSubmit={addTask} aria-label="Add a new task">
          <input
            className="todo-input"
            type="text"
            placeholder="What needs to be done?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="New task title"
          />
          <input
            className="todo-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            aria-label="Optional due date"
            title="Optional due date"
          />
          <button className="todo-add-btn" type="submit" aria-label="Add task">
            + Add
          </button>
        </form>

        {/* Filter pills + Clear Completed */}
        <div className="todo-controls">
          <div className="todo-filters" role="group" aria-label="Filter tasks">
            {['all', 'active', 'completed'].map((f) => (
              <button
                key={f}
                className={`todo-filter-btn${filter === f ? ' todo-filter-btn--active' : ''}`}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Only visible when there is at least one completed task */}
          {completedCount > 0 && (
            <button
              className="todo-clear-btn"
              onClick={clearCompleted}
              aria-label={`Clear ${completedCount} completed task${completedCount !== 1 ? 's' : ''}`}
            >
              Clear completed ({completedCount})
            </button>
          )}
        </div>

        {/* Task list */}
        {visible.length === 0 ? (
          <p className="todo-empty">
            {filter === 'completed' ? 'No completed tasks yet.' :
             filter === 'active'    ? 'Nothing left to do 🎉' :
                                      'Add your first task above.'}
          </p>
        ) : (
          <ul className="todo-list" role="list">
            {visible.map((task) => {
              const overdue = !task.completed && isOverdue(task.dueDate)
              return (
                <li
                  key={task.id}
                  className={[
                    'todo-item',
                    task.completed  ? 'todo-item--done'    : '',
                    overdue         ? 'todo-item--overdue' : '',
                    dragId === task.id     ? 'todo-item--dragging'  : '',
                    dragOverId === task.id ? 'todo-item--drag-over' : '',
                  ].filter(Boolean).join(' ')}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                  onDragOver={(e) => handleDragOver(e, task.id)}
                  onDrop={(e) => handleDrop(e, task.id)}
                  onDragEnd={handleDragEnd}
                  aria-label={`Task: ${task.title}${task.completed ? ', completed' : ''}${overdue ? ', overdue' : ''}`}
                >
                  {/* Drag handle */}
                  <span className="todo-drag-handle" aria-hidden="true" title="Drag to reorder">⠿</span>

                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    className="todo-checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                  />

                  {/* Editable title */}
                  <div className="todo-body">
                    <EditableTitle
                      value={task.title}
                      onSave={(newTitle) => editTitle(task.id, newTitle)}
                    />

                    {/* Due date badge */}
                    {task.dueDate && (
                      <span
                        className={`todo-due${overdue ? ' todo-due--overdue' : ''}`}
                        aria-label={`Due ${task.dueDate}${overdue ? ', overdue' : ''}`}
                      >
                        📅 {task.dueDate}
                      </span>
                    )}
                  </div>

                  {/* Delete */}
                  <button
                    className="todo-delete-btn"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete task "${task.title}"`}
                    title="Delete task"
                  >
                    ✕
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </main>
  )
}
