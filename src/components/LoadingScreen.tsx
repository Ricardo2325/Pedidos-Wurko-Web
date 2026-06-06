export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg gap-6">
      {/* Logo en contenedor blanco */}
      <div className="rounded-2xl bg-white px-6 py-4 shadow-lg shadow-black/20">
        <img
          src="/Logo_Wurko.webp"
          alt="Wurko Padel"
          className="h-14 w-auto"
          draggable={false}
        />
      </div>

      {/* Spinner Wurko */}
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-4 border-bg-elevated" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-brand-green border-r-brand-blue" />
      </div>

      <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
        Cargando carta…
      </p>
    </div>
  )
}
