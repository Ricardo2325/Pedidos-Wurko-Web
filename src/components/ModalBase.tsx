import { useEffect, type ReactNode } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
}

export default function ModalBase({ open, onClose, title, subtitle, children }: Props) {
  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className="modal-sheet relative w-full rounded-t-3xl bg-bg-surface border-t border-border flex flex-col overflow-hidden"
        style={{ maxHeight: '88dvh' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-2 pb-4 border-b border-border flex-shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-xl font-extrabold tracking-tight text-text-primary leading-tight">
              {title.toUpperCase()}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-xs text-text-muted">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-bg-elevated text-text-secondary text-xl font-bold"
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  )
}
