import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Carrito() {
  const { items } = useCart()

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <Link
          to={-1 as unknown as string}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-bg-surface border border-border text-text-secondary font-bold"
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

      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center gap-4">
        {/* SVG cesta */}
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-bg-surface border border-border">
          <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10 text-text-muted" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold text-text-primary mb-1">
            TAREA 7
          </h2>
          <p className="text-sm text-text-secondary">
            Aquí irá la lista completa con cantidades, nota y selector de hora
          </p>
        </div>

        <Link
          to={-1 as unknown as string}
          className="mt-4 rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white"
        >
          Volver a la carta
        </Link>
      </div>
    </div>
  )
}
