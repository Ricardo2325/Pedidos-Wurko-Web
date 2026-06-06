import { useState, useEffect } from 'react'
import type { Producto } from '../types'
import { AllergenBadge } from './AllergenBadge'

const TIPOS_MENU = ['menu_completo', 'medio_menu', 'menu_desayuno', 'menu_desayuno_especial']

interface Props {
  producto: Producto | null
  onClose: () => void
  onAdd: (producto: Producto) => void
  onMenu: (producto: Producto) => void
}

export default function ProductDetailModal({ producto, onClose, onAdd, onMenu }: Props) {
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    if (producto) {
      document.body.style.overflow = 'hidden'
      setImgError(false)
    }
    return () => { document.body.style.overflow = '' }
  }, [producto])

  if (!producto) return null

  const esMenu = TIPOS_MENU.includes(producto.tipo)

  function handleCTA() {
    if (esMenu) onMenu(producto!)
    else onAdd(producto!)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className="modal-sheet relative w-full rounded-t-3xl bg-bg-surface border-t border-border flex flex-col overflow-hidden"
        style={{ maxHeight: '90dvh' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0 absolute top-0 left-0 right-0 z-10">
          <div className="h-1 w-10 rounded-full bg-white/40" />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-bg-elevated/90 text-text-secondary text-xl font-bold shadow-sm"
        >
          ×
        </button>

        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto overscroll-contain">

          {/* Imagen */}
          <div className="relative h-56 w-full bg-bg-elevated flex-shrink-0">
            {producto.foto_url && !imgError ? (
              <img
                src={producto.foto_url}
                alt={producto.nombre}
                className="h-full w-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <img
                  src="/Logo_Wurko.webp"
                  alt=""
                  aria-hidden
                  className="w-1/3 opacity-10 grayscale"
                />
              </div>
            )}
            {esMenu && (
              <span className="absolute bottom-0 left-0 right-0 bg-brand-blue/80 text-center text-[10px] font-bold uppercase tracking-widest text-white py-1">
                Menú
              </span>
            )}
          </div>

          {/* Contenido */}
          <div className="px-5 pt-4 pb-6 flex flex-col gap-5">

            {/* Nombre + precio */}
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-text-primary leading-tight flex-1">
                {producto.nombre.toUpperCase()}
              </h2>
              <span className="text-2xl font-bold text-brand-green flex-shrink-0 pt-0.5">
                {producto.precio.toFixed(2)}€
              </span>
            </div>

            {/* Descripción */}
            {producto.descripcion && (
              <p className="text-sm leading-relaxed text-text-secondary">
                {producto.descripcion}
              </p>
            )}

            {/* Alérgenos */}
            {producto.alergenos != null && (
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  Alérgenos
                </p>
                {producto.alergenos.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {producto.alergenos.map((slug) => (
                      <AllergenBadge key={slug} slug={slug} />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted">Sin alérgenos conocidos</p>
                )}
              </div>
            )}

          </div>
        </div>

        {/* CTA fija */}
        <div className="flex-shrink-0 border-t border-border bg-bg-surface px-4 py-4">
          <button
            onClick={handleCTA}
            className={[
              'w-full rounded-2xl py-4 text-base font-extrabold tracking-tight transition-all duration-150 active:scale-[0.98]',
              esMenu
                ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30'
                : 'bg-brand-green text-bg shadow-lg shadow-brand-green/30',
            ].join(' ')}
          >
            {esMenu
              ? 'Elegir opciones del menú'
              : `Añadir al pedido — ${producto.precio.toFixed(2)}€`}
          </button>
        </div>
      </div>
    </div>
  )
}
