import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ALLERGENS } from '../components/AllergenBadge'
import type { Producto } from '../types'

const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY as string | undefined
const ALLERGEN_KEYS = Object.keys(ALLERGENS)

export default function AdminAlergenos() {
  const [searchParams] = useSearchParams()
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const authorized = Boolean(ADMIN_KEY && searchParams.get('k') === ADMIN_KEY)

  useEffect(() => {
    if (!authorized) return
    supabase
      .from('productos')
      .select('id, nombre, categoria, precio, activo, descripcion, foto_url, tipo, orden, alergenos')
      .order('categoria', { ascending: true })
      .order('orden', { ascending: true })
      .then(({ data }) => {
        if (data) setProductos(data as Producto[])
        setLoading(false)
      })
  }, [authorized])

  async function toggleAlergeno(producto: Producto, slug: string) {
    const current = producto.alergenos ?? []
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug]

    setProductos((prev) =>
      prev.map((p) => (p.id === producto.id ? { ...p, alergenos: next } : p)),
    )
    setSaving(producto.id)
    setSaveError(null)

    const { error } = await supabase
      .from('productos')
      .update({ alergenos: next })
      .eq('id', producto.id)

    if (error) {
      setProductos((prev) =>
        prev.map((p) => (p.id === producto.id ? { ...p, alergenos: current } : p)),
      )
      setSaveError(`Error en "${producto.nombre}": ${error.message}`)
    }
    setSaving(null)
  }

  if (!authorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg">
        <p className="text-sm text-text-muted">Acceso no autorizado</p>
      </div>
    )
  }

  const filtrados = search.trim()
    ? productos.filter(
        (p) =>
          p.nombre.toLowerCase().includes(search.toLowerCase()) ||
          p.categoria.toLowerCase().includes(search.toLowerCase()),
      )
    : productos

  const porCategoria = filtrados.reduce<Record<string, Producto[]>>((acc, p) => {
    if (!acc[p.categoria]) acc[p.categoria] = []
    acc[p.categoria].push(p)
    return acc
  }, {})

  const sinAsignar = productos.filter((p) => !p.alergenos || p.alergenos.length === 0).length

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-10 border-b border-border bg-bg px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-display text-lg font-extrabold tracking-tight text-text-primary">
            ALÉRGENOS
          </h1>
          {sinAsignar > 0 && (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-700">
              {sinAsignar} sin asignar
            </span>
          )}
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto o categoría…"
          className="mt-2 w-full rounded-xl border border-border bg-bg-surface px-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-blue focus:outline-none"
        />
        {saveError && (
          <p className="mt-2 text-xs font-medium text-red-400">{saveError}</p>
        )}
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-text-muted">Cargando productos…</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 px-4 py-4 pb-16">
          {Object.entries(porCategoria).map(([categoria, prods]) => (
            <section key={categoria}>
              <h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                {categoria}
              </h2>
              <div className="flex flex-col gap-3">
                {prods.map((p) => {
                  const asignados = p.alergenos?.length ?? 0
                  return (
                    <div
                      key={p.id}
                      className={[
                        'rounded-2xl border border-border/60 bg-bg-surface p-4 transition-opacity',
                        saving === p.id ? 'opacity-50' : '',
                      ].join(' ')}
                    >
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-text-primary">{p.nombre}</p>
                        {saving === p.id ? (
                          <span className="text-[10px] text-text-muted">Guardando…</span>
                        ) : asignados === 0 ? (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-700">
                            Sin asignar
                          </span>
                        ) : (
                          <span className="text-[10px] text-text-muted">{asignados} alérgeno{asignados !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {ALLERGEN_KEYS.map((slug) => {
                          const active = (p.alergenos ?? []).includes(slug)
                          const label = ALLERGENS[slug].label
                          return (
                            <button
                              key={slug}
                              onClick={() => toggleAlergeno(p, slug)}
                              disabled={saving === p.id}
                              className={[
                                'rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-colors',
                                active
                                  ? 'border border-amber-300 bg-amber-100 text-amber-800'
                                  : 'border border-border bg-bg-elevated text-text-muted',
                              ].join(' ')}
                            >
                              {label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
