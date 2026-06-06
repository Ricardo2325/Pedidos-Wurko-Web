import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useEmpresa } from '../hooks/useEmpresa'
import LoadingScreen from '../components/LoadingScreen'
import EmpresaError from '../components/EmpresaError'
import type { CartItem } from '../types'

// ─── Franjas horarias ────────────────────────────────────────────────────────

const HORA_SLOTS = (() => {
  const now = new Date()
  const hAct = now.getHours()
  const mAct = now.getMinutes()
  const nowMin = hAct * 60 + mAct
  const slots: string[] = ['Lo antes posible']

  const addRange = (fromH: number, toH: number) => {
    for (let h = fromH; h <= toH; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === toH && m > 0) break
        if (h * 60 + m < nowMin) continue
        slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
      }
    }
  }

  if (hAct < 11) addRange(8, 11)
  addRange(13, 16)

  return slots
})()

// ─── Fila del carrito ────────────────────────────────────────────────────────

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity } = useCart()
  const extrasPrice = item.extras.reduce((s, e) => s + e.precio, 0)
  const lineTotal = (item.producto.precio + extrasPrice) * item.cantidad

  const opts = item.menuOpciones
  const opcionLines: string[] = []
  if (opts?.primero) opcionLines.push(`Primero: ${opts.primero}`)
  if (opts?.segundo) opcionLines.push(`Segundo: ${opts.segundo}`)
  if (opts?.postre) opcionLines.push(`Postre: ${opts.postre}`)
  if (opts?.plato) opcionLines.push(`Plato: ${opts.plato}`)
  if (opts?.bebida) opcionLines.push(`Bebida: ${opts.bebida}`)
  if (opts?.cafe) opcionLines.push(`Café: ${opts.cafe}`)

  return (
    <div className="rounded-2xl border border-border/60 bg-bg-surface px-4 py-4">
      {/* Nombre + precio total de línea */}
      <div className="flex items-start justify-between gap-2">
        <p className="flex-1 text-sm font-semibold leading-snug text-text-primary">
          {item.producto.nombre}
        </p>
        <p className="shrink-0 text-base font-bold text-brand-green">
          {lineTotal.toFixed(2)}€
        </p>
      </div>

      {/* Opciones del menú */}
      {opcionLines.map((line, i) => (
        <p key={i} className="mt-0.5 text-xs text-text-secondary">
          {line}
        </p>
      ))}

      {/* Extras */}
      {item.extras.map((e) => (
        <p key={e.id} className="mt-0.5 text-xs text-text-muted">
          + {e.nombre} (+{e.precio.toFixed(2)}€)
        </p>
      ))}

      {/* Nota */}
      {item.nota && (
        <p className="mt-1 text-xs italic text-text-muted">"{item.nota}"</p>
      )}

      {/* Controles de cantidad */}
      <div className="mt-3 flex items-center gap-0">
        <button
          aria-label="Reducir cantidad"
          onClick={() => updateQuantity(item.id, -1)}
          className="flex h-9 w-9 items-center justify-center rounded-l-xl border border-border bg-bg-elevated text-lg font-bold text-text-primary active:bg-bg-surface"
        >
          −
        </button>
        <div className="flex h-9 min-w-[2.5rem] items-center justify-center border-y border-border bg-bg-elevated px-3 text-sm font-bold text-text-primary">
          {item.cantidad}
        </div>
        <button
          aria-label="Aumentar cantidad"
          onClick={() => updateQuantity(item.id, 1)}
          className="flex h-9 w-9 items-center justify-center rounded-r-xl border border-border bg-bg-elevated text-lg font-bold text-brand-green active:bg-bg-surface"
        >
          +
        </button>
        {item.cantidad > 1 && (
          <p className="ml-3 text-xs text-text-muted">
            {(item.producto.precio + extrasPrice).toFixed(2)}€ × {item.cantidad}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Pantalla carrito ────────────────────────────────────────────────────────

export default function Carrito() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('empresa')

  const empresaState = useEmpresa(token)
  const { items, total, notaPedido, setNotaPedido, horaPedido, setHoraPedido } = useCart()

  if (empresaState.status === 'loading') return <LoadingScreen />
  if (empresaState.status === 'error') return <EmpresaError message={empresaState.message} />

  const { empresa } = empresaState
  const costoEnvio = empresa.envio_gratis ? 0 : empresa.coste_envio
  const totalFinal = total + costoEnvio

  // Carrito vacío
  if (items.length === 0) {
    return (
      <div className="flex flex-col bg-bg" style={{ height: '100dvh' }}>
        <header className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-bg-surface text-text-secondary"
            aria-label="Volver"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="font-display text-xl font-extrabold tracking-tight text-text-primary">
            MI PEDIDO
          </h1>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-bg-surface">
            <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10 text-text-muted" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
          <p className="text-sm text-text-muted">Tu pedido está vacío</p>
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white"
          >
            Añadir productos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-bg" style={{ height: '100dvh' }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-bg-surface text-text-secondary"
          aria-label="Volver"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
        </button>
        <h1 className="font-display text-xl font-extrabold tracking-tight text-text-primary">
          MI PEDIDO
        </h1>
        <span className="ml-auto text-xs font-semibold text-text-muted">
          {items.length} línea{items.length !== 1 ? 's' : ''}
        </span>
      </header>

      {/* ── Contenido ──────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pb-56">
        <div className="flex flex-col gap-3 p-4">

          {/* Líneas del pedido */}
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}

          {/* Nota general */}
          <div className="mt-2">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-text-muted">
              Nota general del pedido
            </p>
            <textarea
              value={notaPedido}
              onChange={(e) => setNotaPedido(e.target.value)}
              placeholder="Alergias, instrucciones especiales…"
              rows={2}
              className="w-full resize-none rounded-xl border border-border bg-bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-blue focus:outline-none"
            />
          </div>

          {/* Selector de hora */}
          <div className="mt-1">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-text-muted">
              Hora deseada
            </p>
            <div className="flex flex-wrap gap-2">
              {HORA_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setHoraPedido(slot)}
                  className={[
                    'rounded-xl px-3 py-2 text-xs font-semibold transition-colors active:scale-95',
                    horaPedido === slot
                      ? 'bg-brand-blue text-white'
                      : 'border border-border bg-bg-elevated text-text-secondary',
                  ].join(' ')}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* ── Footer fijo ─────────────────────────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t border-border bg-bg-surface px-5 py-4"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        {/* Total */}
        <div className="mb-4 flex items-baseline justify-between">
          <span className="text-base font-bold text-text-primary">TOTAL</span>
          <span className="text-2xl font-extrabold text-brand-green">
            {totalFinal.toFixed(2)}€
          </span>
        </div>

        {/* Botón confirmar */}
        <button
          onClick={() => navigate(`/datos-cliente?empresa=${token}`)}
          className="w-full rounded-2xl bg-brand-green py-4 text-sm font-bold text-bg shadow-lg shadow-brand-green/30 active:scale-[0.98] transition-transform duration-100"
        >
          Confirmar pedido →
        </button>
      </div>
    </div>
  )
}
