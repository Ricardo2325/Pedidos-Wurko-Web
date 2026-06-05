import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Empresa } from '../types'

type EmpresaState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ok'; empresa: Empresa }

export function useEmpresa(token: string | null): EmpresaState {
  const [state, setState] = useState<EmpresaState>({ status: 'loading' })

  useEffect(() => {
    if (!token) {
      setState({
        status: 'error',
        message: 'Escanea el QR de tu empresa para acceder a la carta.',
      })
      return
    }

    let cancelled = false

    supabase
      .from('empresas')
      .select('id, nombre, token_acceso, envio_gratis, coste_envio, activa')
      .eq('token_acceso', token)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return

        if (error || !data) {
          setState({
            status: 'error',
            message: 'Empresa no encontrada. Verifica que el QR sea correcto.',
          })
          return
        }

        const empresa = data as Empresa

        if (!empresa.activa) {
          setState({
            status: 'error',
            message: 'Este servicio no está disponible en este momento.',
          })
          return
        }

        console.log('[Wurko] Empresa cargada:', empresa.nombre, '| Envío:', empresa.coste_envio)
        setState({ status: 'ok', empresa })
      })

    return () => {
      cancelled = true
    }
  }, [token])

  return state
}
