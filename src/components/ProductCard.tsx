import { useState } from 'react'
import type { Producto } from '../types'

const TIPOS_MENU = ['menu_completo', 'medio_menu', 'menu_desayuno', 'menu_desayuno_especial']

interface Props {
  producto: Producto
  onAdd: (producto: Producto) => void
  onMenu: (producto: Producto) => void
}

export default function ProductCard({ producto, onAdd, onMenu }: Props) {
  const [imgError, setImgError] = useState(false)
  const esMenu = TIPOS_MENU.includes(producto.tipo)

  function handleClick() {
    if (esMenu) onMenu(producto)
    else onAdd(producto)
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-bg-surface border border-border/60 p-3 active:scale-[0.98] transition-transform duration-100">
      {/* Imagen */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-bg-elevated">
        {producto.foto_url && !imgError ? (
          <img
            src={producto.foto_url}
            alt={producto.nombre}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Placeholder: logo Wurko al 10% opacidad */
          <div className="flex h-full w-full items-center justify-center bg-bg-elevated">
            <img
              src="/Logo_Wurko.png"
              alt=""
              aria-hidden
              className="w-4/5 opacity-10 grayscale"
            />
          </div>
        )}

        {/* Badge "MENÚ" */}
        {esMenu && (
          <span className="absolute bottom-0 left-0 right-0 bg-brand-blue/80 text-center text-[9px] font-bold uppercase tracking-widest text-white py-0.5">
            Menú
          </span>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold leading-tight text-text-primary">
          {producto.nombre}
        </h3>
        {producto.descripcion && (
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-text-muted">
            {producto.descripcion}
          </p>
        )}
        <p className="mt-1.5 text-base font-bold text-brand-green">
          {producto.precio.toFixed(2)}€
        </p>
      </div>

      {/* Botón */}
      <button
        onClick={handleClick}
        aria-label={esMenu ? `Ver opciones de ${producto.nombre}` : `Añadir ${producto.nombre}`}
        className={[
          'flex-shrink-0 rounded-xl font-bold transition-all duration-150 active:scale-90',
          esMenu
            ? 'border border-brand-blue/50 bg-brand-blue/10 px-3 py-2 text-xs text-brand-blue'
            : 'h-9 w-9 bg-brand-green text-bg text-xl leading-none shadow-md shadow-brand-green/30',
        ].join(' ')}
      >
        {esMenu ? 'Elegir' : '+'}
      </button>
    </div>
  )
}
