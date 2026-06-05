import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="text-center">
        <p className="font-display text-8xl text-border mb-4">404</p>
        <h1 className="font-body text-xl text-text-primary mb-2">Página no encontrada</h1>
        <p className="font-body text-text-secondary text-sm mb-8">
          Escanea el QR de tu empresa para acceder a la carta.
        </p>
        <Link
          to="/"
          className="inline-block bg-accent text-bg font-body font-semibold px-6 py-3 rounded-xl"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
