import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const SEP = ' | '

export interface MenuDiaData {
  primeros: string[]
  segundos: string[]
  postres: string[]
  pulguita: string | null
  loading: boolean
}

export function useMenuDia(): MenuDiaData {
  const [data, setData] = useState<MenuDiaData>({
    primeros: [],
    segundos: [],
    postres: [],
    pulguita: null,
    loading: true,
  })

  useEffect(() => {
    supabase
      .from('menu_dia')
      .select('tipo, descripcion')
      .then(({ data: rows }) => {
        if (!rows) {
          setData((d) => ({ ...d, loading: false }))
          return
        }

        const split = (tipo: string) =>
          rows
            .filter((r) => r.tipo === tipo)
            .flatMap((r) => r.descripcion.split(SEP).map((s: string) => s.trim()))
            .filter(Boolean)

        setData({
          primeros: split('Primero'),
          segundos: split('Segundo'),
          postres: split('Postre'),
          pulguita: rows.find((r) => r.tipo === 'Pulguita_especial')?.descripcion ?? null,
          loading: false,
        })
      })
  }, [])

  return data
}
