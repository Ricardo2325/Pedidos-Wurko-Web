import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Producto } from '../types'

interface UseProductosResult {
  productos: Producto[]
  loading: boolean
  error: string | null
}

const TIPOS_DESAYUNO = ['menu_desayuno', 'menu_desayuno_especial'] as const
const CACHE_KEY = 'wurko_productos_v1'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

function getCache(): Producto[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) return null
    return data as Producto[]
  } catch { return null }
}

function setCache(data: Producto[]) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }))
  } catch {}
}

function filtrarProductos(data: Producto[]): Producto[] {
  const esDesayunoVisible = new Date().getHours() < 11
  return data.filter((p) => {
    if (!esDesayunoVisible && TIPOS_DESAYUNO.includes(p.tipo as typeof TIPOS_DESAYUNO[number])) return false
    return true
  })
}

export function useProductos(): UseProductosResult {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cached = getCache()
    if (cached) {
      setProductos(filtrarProductos(cached))
      setLoading(false)
      return
    }

    supabase
      .from('productos')
      .select('id, nombre, categoria, precio, activo, descripcion, foto_url, tipo, orden, alergenos')
      .eq('activo', true)
      .order('orden', { ascending: true })
      .then(({ data, error: sbError }) => {
        if (sbError) {
          setError('Error al cargar la carta. Inténtalo de nuevo.')
          setLoading(false)
          return
        }
        const raw = data as Producto[]
        setCache(raw)
        setProductos(filtrarProductos(raw))
        setLoading(false)
      })
  }, [])

  return { productos, loading, error }
}

// ─── Tests básicos (ejecuta en consola del navegador) ─────────────────────────
// console.assert(TIPOS_DESAYUNO.includes('menu_desayuno'), 'menu_desayuno debe filtrarse')
// console.assert(!TIPOS_DESAYUNO.includes('normal'), 'normal no debe filtrarse')
