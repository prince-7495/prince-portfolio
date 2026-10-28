import { useState, useEffect, useRef } from 'react'
import * as api from '../api'
import Toast from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'
import Spinner from '../components/Spinner'
import '../styles/TodoPage.css'

/**
 * TodoPage - Full-stack integration with MongoDB backend
 * 
 * Features:
 * - Fetch tasks from MongoDB via backend API
 * - Create tasks with backend persistence
 * - Edit tasks with inline editing or modal
 * - Delete tasks with confirmation dialog
 * - Mark tasks complete/incomplete
 * - Filter by status (all/active/completed)
 * - Drag and drop reordering (stored locally, not persisted to DB)
 * - Optimistic UI updates with rollback on error
 * - Loading states for each operation
 * - Error handling with toast notifications
 * - Success notifications
 */

// ─── Inline-edit sub-component ───────────────────────────────────────────────
function EditableTitle({ value, onSave, disabled }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef(null)

  function startEdit() {
    if (disabled) return
    setDraft(value)
    setEditing(true)
  }

  function commit() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== value) {
      onSave(trimmed)
    }
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
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') setEditing(false)
        }}
        aria-label="Edit task title"
        disabled={disabled}
      />
    )
  }

  return (
    <span
      className="todo-title"
      onClick={startEdit}
      title={disabled ? 'Cannot edit while saving' : 'Click to edit'}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => e.key === 'Enter' && !disabled && startEdit()}
      style={{ cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.6 : 1 }}
    >
      {value}
    </span>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function TodoPage({ onTaskCountChange }) {
  // Data state
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState('all') // 'all' | 'active' | 'completed'

  // Loading state
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [updatingId, setUpdatingId] = useState(null) // ID of task being updated
  const [deletingId, setDeletingId] = useState(null) // ID of task being deleted

  // UI state
  const [toast, setToast] = useState({ message: '', type: '' })
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    taskId: null,
    taskTitle: '',
  })

  // Drag state
  const [dragId, setDragId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)

  // ── Initial load: Fetch tasks from backend ─────────────────────────────────
  useEffect(() => {
    fetchTasks()
  }, [])

  // ── Sync active count to parent ────────────────────────────────────────────
  useEffect(() => {
    const activeCount = tasks.filter((t) => !t.completed).length
    onTaskCountChange?.(activeCount)
  }, [tasks, onTaskCountChange])

  // ── API calls ──────────────────────────────────────────────────────────────

  /**
   * Fetch all tasks from backend
   */
  async function fetchTasks() {
    setLoading(true)
    try {
      const data = await api.getTasks()
      setTasks(Array.isArray(data) ? data : [])
      setToast({ message: '', type: '' })
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setToast({
        message: `Failed to load tasks: ${error.message}`,
        type: 'error',
      })
      setTasks([]) // Clear tasks on error to show empty state
    } finally {
      setLoading(false)
    }
  }

  /**
   * Create a new task
   */
  async function addTask(e) {
    e.preventDefault()
    const title = input.trim()
    if (!title) {
      setToast({ message: 'Task title cannot be empty', type: 'warning' })
      return
    }

    // Optimistic update: create temporary task with client-side ID
    const tempTask = {
      _id: `temp-${Date.now()}`,
      title,
      description: '',
      completed: false,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _isOptimistic: true, // Mark as optimistic for UI styling
    }

    setTasks((prev) => [tempTask, ...prev])
    setCreating(true)

    try {
      // Send to backend
      const newTask = await api.createTask({
        title,
        description: '',
        completed: false,
        ...(dueDate && { dueDate }),
      })

      // Replace temporary task with real task from server
      setTasks((prev) =>
        prev.map((t) => (t._id === tempTask._id ? newTask : t))
      )

      setInput('')
      setDueDate('')
      setToast({ message: '✓ Task created successfully', type: 'success' })
    } catch (error) {
      console.error('Error creating task:', error)

      // Rollback: remove temporary task on error
      setTasks((prev) => prev.filter((t) => t._id !== tempTask._id))
      setToast({
        message: `Failed to create task: ${error.message}`,
        type: 'error',
      })
    } finally {
      setCreating(false)
    }
  }

  /**
   * Toggle task completion status
   */
  async function toggleTask(task) {
    if (updatingId) return // Prevent concurrent updates

    const newStatus = !task.completed
    const originalTask = { ...task }

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t._id === task._id ? { ...t, completed: newStatus } : t
      )
    )
    setUpdatingId(task._id)

    try {
      const updated = await api.patchTask(task._id, {
        completed: newStatus,
      })

      // Update with confirmed server state
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? updated : t))
      )
    } catch (error) {
      console.error('Error updating task:', error)

      // Rollback to original state
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? originalTask : t))
      )
      setToast({
        message: `Failed to update task: ${error.message}`,
        type: 'error',
      })
    } finally {
      setUpdatingId(null)
    }
  }

  /**
   * Edit task title
   */
  async function editTitle(taskId, newTitle) {
    if (updatingId) return

    const task = tasks.find((t) => t._id === taskId)
    if (!task) return

    const originalTask = { ...task }

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, title: newTitle } : t))
    )
    setUpdatingId(taskId)

    try {
      const updated = await api.patchTask(taskId, { title: newTitle })

      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? updated : t))
      )
      setToast({ message: '✓ Task updated', type: 'success' })
    } catch (error) {
      console.error('Error updating task:', error)

      // Rollback
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? originalTask : t))
      )
      setToast({
        message: `Failed to update task: ${error.message}`,
        type: 'error',
      })
    } finally {
      setUpdatingId(null)
    }
  }

  /**
   * Show delete confirmation
   */
  function confirmDelete(task) {
    setConfirmDialog({
      isOpen: true,
      taskId: task._id,
      taskTitle: task.title,
    })
  }

  /**
   * Actually delete task after confirmation
   */
  async function deleteTask() {
    const { taskId } = confirmDialog

    // Close dialog
    setConfirmDialog({ isOpen: false, taskId: null, taskTitle: '' })

    // Find the task to delete
    const taskToDelete = tasks.find((t) => t._id === taskId)
    if (!taskToDelete) return

    // Optimistic update: remove from UI
    const originalTasks = [...tasks]
    setTasks((prev) => prev.filter((t) => t._id !== taskId))
    setDeletingId(taskId)

    try {
      await api.deleteTask(taskId)
      setToast({ message: '✓ Task deleted successfully', type: 'success' })
    } catch (error) {
      console.error('Error deleting task:', error)

      // Rollback: restore task
      setTasks(originalTasks)
      setToast({
        message: `Failed to delete task: ${error.message}`,
        type: 'error',
      })
    } finally {
      setDeletingId(null)
    }
  }

  /**
   * Clear all completed tasks
   */
  async function clearCompleted() {
    const completedTasks = tasks.filter((t) => t.completed)
    if (completedTasks.length === 0) return

    // Delete each completed task
    for (const task of completedTasks) {
      try {
        await api.deleteTask(task._id)
      } catch (error) {
        console.error('Error deleting completed task:', error)
        setToast({
          message: `Failed to delete some tasks: ${error.message}`,
          type: 'error',
        })
        break // Stop on first error
      }
    }

    // Re-fetch tasks to ensure consistency
    fetchTasks()
  }

  // ── Drag and drop ──────────────────────────────────────────────────────────
  function handleDragStart(id) {
    setDragId(id)
  }

  function handleDragOver(e, id) {
    e.preventDefault()
    setDragOverId(id)
  }

  function handleDrop(e, targetId) {
    e.preventDefault()
    if (dragId === targetId) return

    setTasks((prev) => {
      const from = prev.findIndex((t) => t._id === dragId)
      const to = prev.findIndex((t) => t._id === targetId)
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

  // ── Filtered view ──────────────────────────────────────────────────────────
  const visible = tasks.filter((t) => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const activeCount = tasks.filter((t) => !t.completed).length
  const completedCount = tasks.filter((t) => t.completed).length

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className="todo-page" aria-labelledby="todo-heading">
      <div className="todo-container">
        {/* Header */}
        <div className="todo-header">
          <span className="section-label" aria-hidden="true">
            Productivity
          </span>
          <h1 className="section-title" id="todo-heading">
            To-Do List
          </h1>
          <p className="section-sub">
            {activeCount} task{activeCount !== 1 ? 's' : ''} remaining • Synced
            with database
          </p>
        </div>

        {/* Add-task form */}
        <form
          className="todo-form"
          onSubmit={addTask}
          aria-label="Add a new task"
        >
          <input
            className="todo-input"
            type="text"
            placeholder="What needs to be done?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="New task title"
            disabled={creating}
          />
          <input
            className="todo-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            aria-label="Optional due date"
            title="Optional due date"
            disabled={creating}
          />
          <button
            className="todo-add-btn"
            type="submit"
            aria-label="Add task"
            disabled={creating}
          >
            {creating ? <Spinner /> : '+ Add'}
          </button>
        </form>

        {/* Loading state */}
        {loading && (
          <div className="todo-loading">
            <Spinner />
            <p>Loading tasks...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Filter pills + Clear Completed */}
            <div className="todo-controls">
              <div
                className="todo-filters"
                role="group"
                aria-label="Filter tasks"
              >
                {['all', 'active', 'completed'].map((f) => (
                  <button
                    key={f}
                    className={`todo-filter-btn${
                      filter === f ? ' todo-filter-btn--active' : ''
                    }`}
                    onClick={() => setFilter(f)}
                    aria-pressed={filter === f}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              {completedCount > 0 && (
                <button
                  className="todo-clear-btn"
                  onClick={clearCompleted}
                  aria-label={`Clear ${completedCount} completed task${
                    completedCount !== 1 ? 's' : ''
                  }`}
                >
                  Clear completed ({completedCount})
                </button>
              )}
            </div>

            {/* Task list */}
            {visible.length === 0 ? (
              <p className="todo-empty">
                {filter === 'completed'
                  ? 'No completed tasks yet.'
                  : filter === 'active'
                    ? 'Nothing left to do 🎉'
                    : 'Add your first task above.'}
              </p>
            ) : (
              <ul className="todo-list" role="list">
                {visible.map((task) => (
                  <li
                    key={task._id}
                    className={[
                      'todo-item',
                      task.completed ? 'todo-item--done' : '',
                      task._isOptimistic ? 'todo-item--optimistic' : '',
                      dragId === task._id ? 'todo-item--dragging' : '',
                      dragOverId === task._id ? 'todo-item--drag-over' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    draggable
                    onDragStart={() => handleDragStart(task._id)}
                    onDragOver={(e) => handleDragOver(e, task._id)}
                    onDrop={(e) => handleDrop(e, task._id)}
                    onDragEnd={handleDragEnd}
                    aria-label={`Task: ${task.title}${
                      task.completed ? ', completed' : ''
                    }`}
                  >
                    {/* Drag handle */}
                    <span
                      className="todo-drag-handle"
                      aria-hidden="true"
                      title="Drag to reorder"
                    >
                      ⠿
                    </span>

                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      className="todo-checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task)}
                      aria-label={`Mark "${task.title}" as ${
                        task.completed ? 'incomplete' : 'complete'
                      }`}
                      disabled={updatingId === task._id}
                    />

                    {/* Editable title */}
                    <div className="todo-body">
                      <EditableTitle
                        value={task.title}
                        onSave={(newTitle) => editTitle(task._id, newTitle)}
                        disabled={updatingId === task._id}
                      />

                      {/* Due date badge */}
                      {task.dueDate && (
                        <span
                          className="todo-due"
                          aria-label={`Due ${task.dueDate}`}
                        >
                          📅 {task.dueDate}
                        </span>
                      )}
                    </div>

                    {/* Delete */}
                    <button
                      className="todo-delete-btn"
                      onClick={() => confirmDelete(task)}
                      aria-label={`Delete task "${task.title}"`}
                      title="Delete task"
                      disabled={updatingId === task._id || deletingId === task._id}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {/* Toast notification */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast({ message: '', type: '' })}
          duration={toast.type === 'error' ? 5000 : 3000}
        />
      )}

      {/* Confirm delete dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Task?"
        message={`Are you sure you want to delete "${confirmDialog.taskTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={deleteTask}
        onCancel={() =>
          setConfirmDialog({ isOpen: false, taskId: null, taskTitle: '' })
        }
        isDangerous={true}
        isLoading={deletingId === confirmDialog.taskId}
      />
    </main>
  )
}
