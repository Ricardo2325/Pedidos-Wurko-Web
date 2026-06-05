// Tarea 7 → pantalla completa del carrito
// Por ahora: placeholder para que la ruta exista
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Carrito() {
  const { items } = useCart()

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <Link
          to={-1 as unknown as string}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-bg-surface border border-border text-text-secondary"
        >
          ←
        </Link>
        <h1 className="font-display text-xl font-extrabold tracking-tight text-text-primary">
          MI PEDIDO
        </h1>
        <span className="ml-auto text-xs font-semibold text-text-muted">
          {items.length} línea{items.length !== 1 ? 's' : ''}
        </span>
      </header>

      {/* Placeholder Tarea 7 */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 text-5xl">🛒</span>
        <h2 className="font-display text-2xl font-bold text-text-primary mb-2">
          TAREA 7
        </h2>
        <p className="text-sm text-text-secondary">
          Aquí irá la lista completa con cantidades, nota y selector de hora
        </p>
        <Link
          to={-1 as unknown as string}
          className="mt-8 rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white"
        >
          ← Volver a la carta
        </Link>
      </div>
    </div>
  )
}
