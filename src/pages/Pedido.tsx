export default function Pedido() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="text-center px-6">
        {/* Logo placeholder — se reemplazará con logo real en Tarea 2 */}
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-bg-surface border border-brand-blue/30">
          <span className="text-4xl">🏓</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-text-primary mb-1 tracking-tight">
          WURKO <span className="text-brand-green">PADEL</span>
        </h1>
        <p className="font-body text-text-secondary text-sm font-medium">Cafetería · Pedidos online</p>
        <p className="font-body text-text-muted text-xs mt-6 bg-bg-surface rounded-xl px-4 py-2 border border-border">
          Tarea 2 → cargando empresa…
        </p>
      </div>
    </div>
  )
}
