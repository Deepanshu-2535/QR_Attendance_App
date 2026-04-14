import { X } from 'lucide-react'

export default function Modal({ open, title, description, children, onClose }) {
  if (!open) return null

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 className="card-title">{title}</h2>
            {description ? <p className="subtle-text">{description}</p> : null}
          </div>
          <button type="button" className="ghost-icon-button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
