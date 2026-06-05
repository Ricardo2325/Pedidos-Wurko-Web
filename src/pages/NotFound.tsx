import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 gap-4">
      <div className="rounded-2xl bg-white px-6 py-4 shadow-lg shadow-black/20 mb-4">
        <img src="/Logo_Wurko.png" alt="Wurko Padel" className="h-12 w-auto" draggable={false} />
      </div>

      <p className="font-display text-7xl font-black text-border">404</p>
      <h1 className="font-body text-lg font-semibold text-text-primary">Página no encontrada</h1>
      <p className="font-body text-text-secondary text-sm text-center max-w-xs">
        Escanea el QR de tu empresa para acceder a la carta.
      </p>
      <Link
        to="/"
        className="mt-4 inline-block bg-brand-blue text-white font-body font-semibold px-6 py-3 rounded-xl text-sm"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
