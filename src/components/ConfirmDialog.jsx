import '../styles/ConfirmDialog.css'

/**
 * Confirmation Dialog Component
 * Modal dialog for confirming destructive actions like delete
 * 
 * Usage:
 *   <ConfirmDialog
 *     isOpen={showDialog}
 *     title="Delete Task?"
 *     message="Are you sure you want to delete 'Task Title'? This cannot be undone."
 *     confirmText="Delete"
 *     onConfirm={handleDelete}
 *     onCancel={handleCancel}
 *     isDangerous={true}
 *   />
 */
export default function ConfirmDialog({
  isOpen = false,
  title = 'Confirm',
  message = 'Are you sure?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm = () => {},
  onCancel = () => {},
  isDangerous = false, // Red button for dangerous actions
  isLoading = false, // Show loading state
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="confirm-dialog-overlay" onClick={onCancel} role="presentation">
      <dialog
        className="confirm-dialog"
        open
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        {/* Header */}
        <div className="confirm-dialog__header">
          <h2 className="confirm-dialog__title" id="confirm-title">
            {title}
          </h2>
          <button
            className="confirm-dialog__close"
            onClick={onCancel}
            aria-label="Close dialog"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        {/* Message */}
        <div className="confirm-dialog__body">
          <p className="confirm-dialog__message" id="confirm-message">
            {message}
          </p>
        </div>

        {/* Buttons */}
        <div className="confirm-dialog__footer">
          <button
            className="confirm-dialog__cancel"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className={`confirm-dialog__confirm ${
              isDangerous ? 'confirm-dialog__confirm--danger' : ''
            }`}
            onClick={onConfirm}
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-small" />
                {confirmText}
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </dialog>
    </div>
  )
}
