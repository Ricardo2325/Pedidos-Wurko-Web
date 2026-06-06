import { useState } from 'react'
import type { Producto } from '../types'

const TIPOS_MENU = ['menu_completo', 'medio_menu', 'menu_desayuno', 'menu_desayuno_especial']

interface Props {
  producto: Producto
  onAdd: (producto: Producto) => void
  onMenu: (producto: Producto) => void
  onDetail?: (producto: Producto) => void
  isFavorito?: boolean
  onToggleFavorito?: (id: string) => void
}

export default function ProductCard({ producto, onAdd, onMenu, onDetail, isFavorito, onToggleFavorito }: Props) {
  const [imgError, setImgError] = useState(false)
  const esMenu = TIPOS_MENU.includes(producto.tipo)

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (esMenu) onMenu(producto)
    else onAdd(producto)
  }

  function handleFavorito(e: React.MouseEvent) {
    e.stopPropagation()
    onToggleFavorito?.(producto.id)
  }

  return (
    <div
      className="flex items-center gap-3 rounded-2xl bg-bg-surface border border-border/60 p-3 active:scale-[0.98] transition-transform duration-100 cursor-pointer"
      onClick={() => onDetail?.(producto)}
    >
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

        {/* Botón favorito */}
        {onToggleFavorito !== undefined && (
          <button
            onClick={handleFavorito}
            aria-label={isFavorito ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-bg/75 backdrop-blur-sm transition-transform duration-100 active:scale-90"
          >
            <svg
              viewBox="0 0 24 24"
              className={`h-3.5 w-3.5 transition-colors duration-150 ${isFavorito ? 'text-red-400' : 'text-text-muted'}`}
              fill={isFavorito ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={isFavorito ? 0 : 1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
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

      {/* Botón añadir / elegir */}
      <button
        onClick={(e) => handleClick(e)}
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
