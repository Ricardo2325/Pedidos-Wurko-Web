import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useEmpresa } from '../hooks/useEmpresa'
import { useProductos } from '../hooks/useProductos'
import { useCart } from '../context/CartContext'
import EmpresaError from '../components/EmpresaError'
import LoadingScreen from '../components/LoadingScreen'
import CategoryTabs from '../components/CategoryTabs'
import ProductCard from '../components/ProductCard'
import type { Producto } from '../types'

// ─── Toast mínimo (se reutilizará en Tarea 5) ────────────────────────────────
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-sm rounded-2xl bg-bg-elevated border border-border px-5 py-3 text-center text-sm font-medium text-text-primary shadow-xl">
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
  const { addSimple } = useCart()

  const [activeCategory, setActiveCategory] = useState<string>('')
  const [toast, setToast] = useState<string | null>(null)

  // Derivar lista de categorías en el orden que aparecen los productos
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

  // Seleccionar primera categoría al cargar
  useEffect(() => {
    if (categorias.length > 0 && !activeCategory) {
      setActiveCategory(categorias[0])
    }
  }, [categorias, activeCategory])

  // ── Guards ──────────────────────────────────────────────────────────────────
  if (empresaState.status === 'loading' || loadingProductos) return <LoadingScreen />
  if (empresaState.status === 'error') return <EmpresaError message={empresaState.message} />

  const { empresa } = empresaState

  // Productos de la categoría activa
  const productosFiltrados = productos.filter((p) => p.categoria === activeCategory)

  // ── Handlers ────────────────────────────────────────────────────────────────
  function handleAdd(producto: Producto) {
    addSimple(producto)
    setToast(`✅ ${producto.nombre} añadido`)
  }

  function handleMenu(producto: Producto) {
    // Tarea 6 → modal de menú. Por ahora, aviso.
    setToast('🍽️ Selección de menú próximamente')
    void producto
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen flex-col bg-bg" style={{ height: '100dvh' }}>

      {/* ── Header sticky ─────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 bg-bg border-b border-border">
        {/* Top bar: empresa */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
              {empresa.nombre}
            </p>
            <h1 className="text-xl font-extrabold tracking-tight text-text-primary leading-tight">
              WURKO <span className="text-brand-green">PADEL</span>
            </h1>
          </div>
          {/* Indicador de envío */}
          <div className="rounded-xl bg-bg-surface border border-border px-3 py-1.5 text-right">
            {empresa.envio_gratis ? (
              <span className="text-[10px] font-semibold text-brand-green">Envío gratis</span>
            ) : (
              <>
                <p className="text-[9px] text-text-muted leading-none">Envío</p>
                <p className="text-xs font-bold text-text-secondary">
                  {empresa.coste_envio.toFixed(2)}€
                </p>
              </>
            )}
          </div>
        </div>

        {/* Tabs de categorías */}
        {categorias.length > 0 && (
          <CategoryTabs
            categories={categorias}
            active={activeCategory}
            onSelect={setActiveCategory}
          />
        )}
      </header>

      {/* ── Lista de productos ─────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {productosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <span className="text-4xl mb-3">🍽️</span>
            <p className="text-sm">No hay productos en esta categoría</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2 p-4 pb-32">
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

      {/* ── Tarea 4: CartBar aquí ─────────────────────────────────────────── */}

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
