interface Props {
  message: string
}

export default function EmpresaError({ message }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6">
      {/* Logo */}
      <div className="mb-8 rounded-2xl bg-white px-6 py-4 shadow-lg shadow-black/20">
        <img src="/Logo_Wurko.webp" alt="Wurko Padel" className="h-14 w-auto" draggable={false} />
      </div>

      {/* Icono error — sin emoji, SVG inline */}
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-950/40 border border-red-900/30">
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-red-400" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>

      <h1 className="mb-3 text-center font-display text-2xl font-extrabold tracking-tight text-text-primary">
        ACCESO NO VÁLIDO
      </h1>

      <p className="mb-8 max-w-xs text-center text-sm leading-relaxed text-text-secondary">
        {message}
      </p>

      <div className="h-px w-16 bg-gradient-to-r from-brand-blue to-brand-green" />

      <p className="mt-8 text-center text-xs text-text-muted">
        Si crees que es un error, contacta con{' '}
        <span className="font-semibold text-brand-blue">Wurko Padel</span>
      </p>
    </div>
  )
}
