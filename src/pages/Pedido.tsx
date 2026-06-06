import { useState, useMemo, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useEmpresa } from '../hooks/useEmpresa'
import { useProductos } from '../hooks/useProductos'
import { useMenuDia } from '../hooks/useMenuDia'
import { useFavoritos } from '../hooks/useFavoritos'
import EmpresaError from '../components/EmpresaError'
import LoadingScreen from '../components/LoadingScreen'
import CategoryTabs from '../components/CategoryTabs'
import ProductCard from '../components/ProductCard'
import CartBar from '../components/CartBar'
import ExtrasModal from '../components/ExtrasModal'
import MenuModal from '../components/MenuModal'
import ProductDetailModal from '../components/ProductDetailModal'
import type { Producto } from '../types'

const CAT_FAVORITOS = 'Favoritos'

const CATEGORIAS_BEBIDA = [
  'Bebidas Refrescos', 'Agua', 'Zumos y Batidos',
  'Cervezas', 'Vino', 'Cafés', 'Infusiones',
]

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed bottom-24 left-4 right-4 z-40 mx-auto max-w-sm rounded-2xl border border-border bg-bg-elevated px-5 py-3 text-center text-sm font-medium text-text-primary shadow-xl">
      {message}
    </div>
  )
}

// ─── Página principal ────────────────────────────────────────────────────────
export default function Pedido() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('empresa')

  const empresaState = useEmpresa(token)
  const { productos, loading: loadingProductos } = useProductos()
  const menuDia = useMenuDia()
  const { isFavorito, toggleFavorito, favoritos } = useFavoritos()

  const [activeCategory, setActiveCategory] = useState<string>('')
  const [toast, setToast] = useState<string | null>(null)
  const [detalleProducto, setDetalleProducto] = useState<Producto | null>(null)
  const [extrasProducto, setExtrasProducto] = useState<Producto | null>(null)
  const [menuProducto, setMenuProducto] = useState<Producto | null>(null)

  // Búsqueda
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  // ── Datos derivados ──────────────────────────────────────────────────────
  const categorias = useMemo(() => {
    const seen = new Set<string>()
    const result: string[] = []
    for (const p of productos) {
      if (!seen.has(p.categoria)) {
        seen.add(p.categoria)
        result.push(p.categoria)
      }
    }
    return result
  }, [productos])

  // Añade la tab "Favoritos" al inicio solo si hay alguno guardado
  const categoriasConFavoritos = useMemo(() => {
    return favoritos.size > 0 ? [CAT_FAVORITOS, ...categorias] : categorias
  }, [categorias, favoritos.size])

  const extras = useMemo(
    () => productos.filter((p) => p.categoria === 'Extras' || p.categoria === 'Suplementos Menú'),
    [productos],
  )

  const bebidas = useMemo(
    () => productos.filter((p) => CATEGORIAS_BEBIDA.includes(p.categoria)),
    [productos],
  )

  const cafes = useMemo(
    () => productos.filter((p) => p.categoria === 'Cafés'),
    [productos],
  )

  // Productos a mostrar: búsqueda > favoritos > categoría activa
  const productosMostrados = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return productos.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.descripcion?.toLowerCase().includes(q),
      )
    }
    if (activeCategory === CAT_FAVORITOS) {
      return productos.filter((p) => isFavorito(p.id))
    }
    return productos.filter((p) => p.categoria === activeCategory)
  }, [searchQuery, activeCategory, productos, isFavorito])

  // Inicializar categoría activa cuando cargan los productos
  useEffect(() => {
    if (categorias.length > 0 && !activeCategory) {
      setActiveCategory(categorias[0])
    }
  }, [categorias, activeCategory])

  // Si se borran todos los favoritos mientras se está en esa tab, volver a la primera
  useEffect(() => {
    if (activeCategory === CAT_FAVORITOS && favoritos.size === 0) {
      setActiveCategory(categorias[0] ?? '')
    }
  }, [favoritos.size, activeCategory, categorias])

  // Focus en el input al abrir el buscador
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [searchOpen])

  // ── Guards ──────────────────────────────────────────────────────────────
  if (empresaState.status === 'loading' || loadingProductos) return <LoadingScreen />
  if (empresaState.status === 'error') return <EmpresaError message={empresaState.message} />

  const { empresa } = empresaState

  // ── Handlers ────────────────────────────────────────────────────────────
  function openSearch() {
    setSearchOpen(true)
  }

  function closeSearch() {
    setSearchQuery('')
    setSearchOpen(false)
  }

  function handleDetail(producto: Producto) {
    setDetalleProducto(producto)
  }

  function handleAdd(producto: Producto) {
    setExtrasProducto(producto)
  }

  function handleMenu(producto: Producto) {
    setMenuProducto(producto)
  }

  function handleDetailAdd(producto: Producto) {
    setDetalleProducto(null)
    setExtrasProducto(producto)
  }

  function handleDetailMenu(producto: Producto) {
    setDetalleProducto(null)
    setMenuProducto(producto)
  }

  const isSearching = searchQuery.trim().length > 0

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col bg-bg" style={{ height: '100dvh' }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 border-b border-border bg-bg">

        {/* Fila logo / nombre empresa */}
        {searchOpen ? (
          /* Modo búsqueda: reemplaza la fila de logo */
          <div className="flex items-center gap-2 px-4 pb-2 pt-3">
            <button
              onClick={closeSearch}
              aria-label="Cerrar búsqueda"
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-bg-surface text-text-secondary"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="relative flex-1">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
              >
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busca un producto..."
                className="w-full rounded-xl border border-border bg-bg-surface py-2 pl-9 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-blue focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                  aria-label="Limpiar búsqueda"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-3">
            <div className="flex-shrink-0 rounded-xl bg-white px-3 py-1.5 shadow shadow-black/10">
              <img src="/Logo_Wurko.png" alt="Wurko Padel" className="h-9 w-auto" draggable={false} />
            </div>
            <p className="flex-1 truncate text-xs font-semibold text-text-secondary">
              {empresa.nombre}
            </p>
            {/* Botón búsqueda */}
            <button
              onClick={openSearch}
              aria-label="Buscar producto"
              className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-bg-surface text-text-secondary"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="flex-shrink-0 rounded-xl border border-border bg-bg-surface px-3 py-1.5 text-right">
              {empresa.envio_gratis ? (
                <span className="text-[10px] font-semibold text-brand-green">Envío gratis</span>
              ) : (
                <>
                  <p className="text-[9px] leading-none text-text-muted">Envío</p>
                  <p className="text-xs font-bold text-text-secondary">
                    {empresa.coste_envio.toFixed(2)}€
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Tabs de categoría — ocultas mientras se busca */}
        {!searchOpen && categoriasConFavoritos.length > 0 && (
          <CategoryTabs
            categories={categoriasConFavoritos}
            active={activeCategory}
            onSelect={setActiveCategory}
          />
        )}
      </header>

      {/* ── Lista de productos ──────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {/* Estado vacío de búsqueda sin query */}
        {searchOpen && !isSearching ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-text-muted">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-10 w-10 opacity-30">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
            </svg>
            <p className="text-sm">Escribe para buscar en la carta</p>
          </div>
        ) : productosMostrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-text-muted">
            {activeCategory === CAT_FAVORITOS ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-10 w-10 opacity-30">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <p className="text-sm">Todavía no tenés favoritos</p>
                <p className="text-xs">Tocá el corazón en cualquier producto</p>
              </>
            ) : (
              <>
                <div className="h-px w-12 bg-border" />
                <p className="text-sm">
                  {isSearching ? 'Sin resultados para esa búsqueda' : 'No hay productos en esta categoría'}
                </p>
              </>
            )}
          </div>
        ) : (
          <ul className="flex flex-col gap-2 p-4 pb-36">
            {productosMostrados.map((producto) => (
              <li key={producto.id}>
                <ProductCard
                  producto={producto}
                  onAdd={handleAdd}
                  onMenu={handleMenu}
                  onDetail={handleDetail}
                  isFavorito={isFavorito(producto.id)}
                  onToggleFavorito={toggleFavorito}
                />
              </li>
            ))}
          </ul>
        )}
      </main>

      <CartBar />

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* ── Modales ─────────────────────────────────────────────────────── */}
      <ProductDetailModal
        producto={detalleProducto}
        onClose={() => setDetalleProducto(null)}
        onAdd={handleDetailAdd}
        onMenu={handleDetailMenu}
      />

      <ExtrasModal
        producto={extrasProducto}
        extras={extras}
        onClose={() => setExtrasProducto(null)}
        onAdded={() => { setExtrasProducto(null); setToast('Añadido al pedido') }}
      />

      <MenuModal
        producto={menuProducto}
        menuDia={menuDia}
        bebidas={bebidas}
        cafes={cafes}
        onClose={() => setMenuProducto(null)}
        onAdded={() => { setMenuProducto(null); setToast('Menú añadido al pedido') }}
      />
    </div>
  )
}
