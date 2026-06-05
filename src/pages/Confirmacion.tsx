export default function Confirmacion() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6">
      <div className="mb-8 rounded-2xl bg-white px-6 py-4 shadow-lg shadow-black/20">
        <img src="/Logo_Wurko.png" alt="Wurko Padel" className="h-14 w-auto" draggable={false} />
      </div>

      {/* Icono check — SVG */}
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-green/10 border border-brand-green/30">
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-brand-green" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <h1 className="font-display text-3xl font-extrabold tracking-tight text-text-primary mb-2 text-center">
        PEDIDO RECIBIDO
      </h1>
      <p className="font-body text-text-secondary text-sm text-center">
        Tarea 10 — pantalla de confirmación completa
      </p>
    </div>
  )
}
