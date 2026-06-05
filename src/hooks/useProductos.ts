import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Producto } from '../types'

interface UseProductosResult {
  productos: Producto[]
  loading: boolean
  error: string | null
}

const TIPOS_DESAYUNO = ['menu_desayuno', 'menu_desayuno_especial'] as const

export function useProductos(): UseProductosResult {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const horaActual = new Date().getHours()
    const esDesayunoVisible = horaActual < 11

    supabase
      .from('productos')
      .select('id, nombre, categoria, precio, activo, descripcion, foto_url, tipo, orden')
      .eq('activo', true)
      .order('orden', { ascending: true })
      .then(({ data, error: sbError }) => {
        if (sbError) {
          setError('Error al cargar la carta. Inténtalo de nuevo.')
          setLoading(false)
          return
        }

        const items = (data as Producto[]).filter((p) => {
          // Ocultar menús desayuno si ya son las 11:00 o más
          if (!esDesayunoVisible && TIPOS_DESAYUNO.includes(p.tipo as typeof TIPOS_DESAYUNO[number])) {
            return false
          }
          return true
        })

        setProductos(items)
        setLoading(false)
      })
  }, [])

  return { productos, loading, error }
}

// ─── Tests básicos (ejecuta en consola del navegador) ─────────────────────────
// console.assert(TIPOS_DESAYUNO.includes('menu_desayuno'), 'menu_desayuno debe filtrarse')
// console.assert(!TIPOS_DESAYUNO.includes('normal'), 'normal no debe filtrarse')
