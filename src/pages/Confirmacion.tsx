import { useEffect } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import type { CartItem } from '../types'

interface ConfirmacionState {
  nombre: string
  codigoPedido: string
  items: CartItem[]
  subtotal: number
  costoEnvio: number
  totalFinal: number
  horaPedido: string
  empresaNombre: string
}

export default function Confirmacion() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('empresa')
  const location = useLocation()
  const state = location.state as ConfirmacionState | null
  const { clearCart } = useCart()

  // Limpia el carrito una sola vez al montar (el snapshot ya está en state)
  useEffect(() => {
    clearCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Si llegaron sin state (acceso directo), redirigir a la carta
  if (!state?.codigoPedido) {
    navigate(`/pedido?empresa=${token}`, { replace: true })
    return null
  }

  const { nombre, codigoPedido, items, totalFinal, horaPedido, empresaNombre } = state

  return (
    <div className="flex flex-col bg-bg" style={{ minHeight: '100dvh' }}>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className="flex shrink-0 items-center justify-center border-b border-border px-4 py-4">
        <div className="rounded-xl bg-white px-4 py-2 shadow shadow-black/10">
          <img src="/Logo_Wurko.png" alt="Wurko Padel" className="h-8 w-auto" draggable={false} />
        </div>
      </header>

      <main className="flex-1 px-5 py-6">
        <div className="mx-auto max-w-sm space-y-5">

          {/* ── Confirmación ──────────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green/10 border border-brand-green/30">
              <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-brand-green" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>

            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-text-primary">
                PEDIDO RECIBIDO
              </h1>
              <p className="mt-0.5 text-sm text-text-muted">
                Gracias, {nombre}
              </p>
            </div>

            {/* Código del pedido — visible y grande */}
            <div className="rounded-2xl border border-brand-blue/30 bg-brand-blue/10 px-6 py-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-brand-blue/70 mb-0.5">
                Tu pedido
              </p>
              <p className="font-display text-3xl font-extrabold tracking-tight text-brand-blue">
                {codigoPedido}
              </p>
            </div>

            <p className="text-xs text-text-muted">
              Para las{' '}
              <span className="font-semibold text-text-secondary">
                {horaPedido}
              </span>
              {' · '}{empresaNombre}
            </p>
          </div>

          {/* ── Resumen del pedido ────────────────────────────────────── */}
          <div className="rounded-2xl border border-border bg-bg-surface">
            <p className="border-b border-border px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-text-muted">
              Resumen
            </p>

            <div className="divide-y divide-border/50">
              {items.map((item) => {
                const extrasTotal = item.extras.reduce((s, e) => s + e.precio, 0)
                const lineTotal = (item.producto.precio + extrasTotal) * item.cantidad
                const opts = item.menuOpciones
                const opLines: string[] = []
                if (opts?.primero) opLines.push(`Primero: ${opts.primero}`)
                if (opts?.segundo) opLines.push(`Segundo: ${opts.segundo}`)
                if (opts?.postre) opLines.push(`Postre: ${opts.postre}`)
                if (opts?.plato) opLines.push(`Plato: ${opts.plato}`)
                if (opts?.bebida) opLines.push(`Bebida: ${opts.bebida}`)
                if (opts?.cafe) opLines.push(`Café: ${opts.cafe}`)

                return (
                  <div key={item.id} className="flex items-start justify-between gap-3 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary">
                        {item.cantidad > 1 && (
                          <span className="mr-1.5 text-brand-green">{item.cantidad}×</span>
                        )}
                        {item.producto.nombre}
                      </p>
                      {opLines.map((l, i) => (
                        <p key={i} className="text-xs text-text-secondary truncate">{l}</p>
                      ))}
                      {item.extras.map((e) => (
                        <p key={e.id} className="text-xs text-text-muted">+ {e.nombre}</p>
                      ))}
                      {item.nota && (
                        <p className="text-xs italic text-text-muted">"{item.nota}"</p>
                      )}
                    </div>
                    <p className="shrink-0 text-sm font-bold text-text-primary">
                      {lineTotal.toFixed(2)}€
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Total */}
            <div className="border-t border-border px-4 py-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold text-text-primary">TOTAL</span>
                <span className="text-xl font-extrabold text-brand-green">{totalFinal.toFixed(2)}€</span>
              </div>
            </div>
          </div>

          {/* ── Botón volver ─────────────────────────────────────────── */}
          <button
            onClick={() => navigate(`/pedido?empresa=${token}`)}
            className="w-full rounded-2xl border border-border bg-bg-surface py-4 text-sm font-bold text-text-primary active:scale-[0.98] transition-transform duration-100"
          >
            ← Volver a la carta
          </button>

        </div>
      </main>
    </div>
  )
}
