import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

let nextToastId = 1

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    ({ type = 'info', title, message }) => {
      const id = nextToastId++
      setToasts((current) => [...current, { id, type, title, message }])
      window.setTimeout(() => removeToast(id), 4000)
    },
    [removeToast]
  )

  const value = useMemo(
    () => ({
      showToast
    }),
    [showToast]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <button
            key={toast.id}
            type="button"
            className={`toast toast-${toast.type}`}
            onClick={() => removeToast(toast.id)}
          >
            <strong>{toast.title}</strong>
            {toast.message ? <span>{toast.message}</span> : null}
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }

  return context
}
