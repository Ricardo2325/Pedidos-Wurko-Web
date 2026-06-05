import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useEmpresa } from '../hooks/useEmpresa'
import { useProductos } from '../hooks/useProductos'
import { useMenuDia } from '../hooks/useMenuDia'
import EmpresaError from '../components/EmpresaError'
import LoadingScreen from '../components/LoadingScreen'
import CategoryTabs from '../components/CategoryTabs'
import ProductCard from '../components/ProductCard'
import CartBar from '../components/CartBar'
import ExtrasModal from '../components/ExtrasModal'
import MenuModal from '../components/MenuModal'
import type { Producto } from '../types'

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

  const [activeCategory, setActiveCategory] = useState<string>('')
  const [toast, setToast] = useState<string | null>(null)
  const [extrasProducto, setExtrasProducto] = useState<Producto | null>(null)
  const [menuProducto, setMenuProducto] = useState<Producto | null>(null)

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

  useEffect(() => {
    if (categorias.length > 0 && !activeCategory) {
      setActiveCategory(categorias[0])
    }
  }, [categorias, activeCategory])

  // ── Guards ──────────────────────────────────────────────────────────────
  if (empresaState.status === 'loading' || loadingProductos) return <LoadingScreen />
  if (empresaState.status === 'error') return <EmpresaError message={empresaState.message} />

  const { empresa } = empresaState
  const productosFiltrados = productos.filter((p) => p.categoria === activeCategory)

  // ── Handlers ────────────────────────────────────────────────────────────
  function handleAdd(producto: Producto) {
    setExtrasProducto(producto)
  }

  function handleMenu(producto: Producto) {
    setMenuProducto(producto)
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col bg-bg" style={{ height: '100dvh' }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 border-b border-border bg-bg">
        <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-3">
          <div className="flex-shrink-0 rounded-xl bg-white px-3 py-1.5 shadow shadow-black/10">
            <img src="/Logo_Wurko.png" alt="Wurko Padel" className="h-9 w-auto" draggable={false} />
          </div>
          <p className="flex-1 truncate text-xs font-semibold text-text-secondary">
            {empresa.nombre}
          </p>
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

        {categorias.length > 0 && (
          <CategoryTabs
            categories={categorias}
            active={activeCategory}
            onSelect={setActiveCategory}
          />
        )}
      </header>

      {/* ── Lista de productos ──────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {productosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-text-muted">
            <div className="h-px w-12 bg-border" />
            <p className="text-sm">No hay productos en esta categoría</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2 p-4 pb-36">
            {productosFiltrados.map((producto) => (
              <li key={producto.id}>
                <ProductCard
                  producto={producto}
                  onAdd={handleAdd}
                  onMenu={handleMenu}
                />
              </li>
            ))}
          </ul>
        )}
      </main>

      <CartBar />

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* ── Modales ─────────────────────────────────────────────────────── */}
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
