import { useState, useMemo } from 'react'
import ModalBase from './ModalBase'
import { useCart } from '../context/CartContext'
import type { Producto, CartExtra } from '../types'

interface Props {
  producto: Producto | null
  extras: Producto[]
  onClose: () => void
  onAdded: () => void
}

export default function ExtrasModal({ producto, extras, onClose, onAdded }: Props) {
  const { addItem } = useCart()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [nota, setNota] = useState('')

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const total = useMemo(() => {
    if (!producto) return 0
    const extrasSum = extras
      .filter((e) => selected.has(e.id))
      .reduce((s, e) => s + e.precio, 0)
    return producto.precio + extrasSum
  }, [producto, extras, selected])

  function handleAdd() {
    if (!producto) return
    const cartExtras: CartExtra[] = extras
      .filter((e) => selected.has(e.id))
      .map((e) => ({ id: e.id, nombre: e.nombre, precio: e.precio }))

    addItem({
      id: crypto.randomUUID(),
      producto,
      cantidad: 1,
      extras: cartExtras,
      nota: nota.trim(),
    })

    setSelected(new Set())
    setNota('')
    onAdded()
  }

  return (
    <ModalBase
      open={!!producto}
      onClose={onClose}
      title={producto?.nombre ?? ''}
      subtitle={`Precio base: ${producto?.precio.toFixed(2)}€`}
    >
      <div className="flex flex-col gap-5 px-5 py-4 pb-32">

        {/* Extras */}
        {extras.length > 0 && (
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-text-muted">
              Añadir extras
            </p>
            <div className="flex flex-col gap-2">
              {extras.map((extra) => {
                const checked = selected.has(extra.id)
                return (
                  <label
                    key={extra.id}
                    className={[
                      'flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-colors',
                      checked
                        ? 'border-brand-blue/60 bg-brand-blue/10'
                        : 'border-border/60 bg-bg-elevated',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={[
                          'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-colors',
                          checked ? 'border-brand-blue bg-brand-blue' : 'border-border',
                        ].join(' ')}
                      >
                        {checked && (
                          <svg viewBox="0 0 10 8" fill="none" className="h-3 w-3">
                            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={() => toggle(extra.id)}
                        aria-label={extra.nombre}
                      />
                      <span className="text-sm font-medium text-text-primary">{extra.nombre}</span>
                    </div>
                    <span className="text-sm font-bold text-brand-green">
                      +{extra.precio.toFixed(2)}€
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        )}

        {/* Nota */}
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-text-muted">
            Nota (opcional)
          </p>
          <textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Sin cebolla, bien tostado…"
            rows={2}
            className="w-full resize-none rounded-xl border border-border bg-bg-elevated px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-blue focus:outline-none"
          />
        </div>
      </div>

      {/* Botón fijo */}
      <div
        className="absolute bottom-0 left-0 right-0 border-t border-border bg-bg-surface px-5 py-4"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={handleAdd}
          className="w-full rounded-2xl bg-brand-green py-4 text-sm font-bold text-bg shadow-lg shadow-brand-green/30 active:scale-[0.98] transition-transform duration-100"
        >
          Añadir al pedido · {total.toFixed(2)}€
        </button>
      </div>
    </ModalBase>
  )
}
