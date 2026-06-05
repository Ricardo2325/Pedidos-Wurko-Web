interface Props {
  message: string
}

export default function EmpresaError({ message }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6">
      {/* Icono de error */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-bg-surface border border-red-900/40">
        <span className="text-5xl">⚠️</span>
      </div>

      {/* Título */}
      <h1 className="mb-3 text-center font-display text-2xl font-extrabold tracking-tight text-text-primary">
        ACCESO NO VÁLIDO
      </h1>

      {/* Mensaje */}
      <p className="mb-8 max-w-xs text-center text-sm leading-relaxed text-text-secondary">
        {message}
      </p>

      {/* Separador */}
      <div className="mb-8 h-px w-16 bg-gradient-to-r from-brand-blue to-brand-green" />

      {/* Info de contacto */}
      <p className="text-center text-xs text-text-muted">
        Si crees que es un error, contacta con{' '}
        <span className="font-semibold text-brand-blue">Wurko Padel</span>
      </p>

      {/* Logo / branding */}
      <div className="mt-12 flex items-center gap-2 opacity-40">
        <span className="text-xl">🏓</span>
        <span className="font-display text-sm font-bold tracking-widest text-text-muted uppercase">
          Wurko Padel
        </span>
      </div>
    </div>
  )
}
