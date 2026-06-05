export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg gap-5">
      {/* Spinner con colores Wurko */}
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-bg-elevated" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-brand-green border-r-brand-blue" />
      </div>

      {/* Texto */}
      <div className="text-center">
        <p className="font-display text-xl font-extrabold tracking-widest text-text-primary">
          WURKO <span className="text-brand-green">PADEL</span>
        </p>
        <p className="mt-1 text-xs font-medium text-text-muted">Cargando carta…</p>
      </div>
    </div>
  )
}
