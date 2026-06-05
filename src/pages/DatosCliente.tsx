import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const LS_KEY = 'wurko_cliente'

interface ClienteGuardado {
  nombre: string
  telefono: string
}

export default function DatosCliente() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('empresa')
  const { items } = useCart()

  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [recordar, setRecordar] = useState(false)
  const [error, setError] = useState('')

  // Pre-rellenar desde localStorage si hay datos guardados
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        const saved: ClienteGuardado = JSON.parse(raw)
        setNombre(saved.nombre ?? '')
        setTelefono(saved.telefono ?? '')
        setRecordar(true)
      }
    } catch {
      // localStorage no disponible o JSON inválido
    }
  }, [])

  // Redirigir si llegan sin productos
  useEffect(() => {
    if (items.length === 0) navigate(`/pedido?empresa=${token}`, { replace: true })
  }, [items.length, navigate, token])

  function handleSubmit() {
    const nombreTrimmed = nombre.trim()
    if (!nombreTrimmed) {
      setError('El nombre es obligatorio')
      return
    }
    setError('')

    if (recordar) {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify({ nombre: nombreTrimmed, telefono: telefono.trim() }))
      } catch { /* sin acceso a localStorage */ }
    } else {
      try {
        localStorage.removeItem(LS_KEY)
      } catch { /* sin acceso a localStorage */ }
    }

    navigate(`/confirmacion?empresa=${token}`, {
      state: { nombre: nombreTrimmed, telefono: telefono.trim() },
    })
  }

  return (
    <div className="flex flex-col bg-bg" style={{ height: '100dvh' }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-bg-surface text-text-secondary"
          aria-label="Volver"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
        </button>
        <h1 className="font-display text-xl font-extrabold tracking-tight text-text-primary">
          TUS DATOS
        </h1>
      </header>

      {/* ── Formulario ─────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pb-48">
        <div className="flex flex-col gap-6 p-5">

          <p className="text-sm text-text-muted">
            Para identificar tu pedido en la pantalla de cocina.
          </p>

          {/* Nombre */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-text-muted">
              Nombre <span className="text-brand-green">*</span>
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => { setNombre(e.target.value); setError('') }}
              placeholder="Tu nombre o apodo"
              autoComplete="given-name"
              className="w-full rounded-xl border border-border bg-bg-surface px-4 py-3 text-base text-text-primary placeholder:text-text-muted focus:border-brand-blue focus:outline-none"
            />
            {error && (
              <p className="mt-1.5 text-xs font-medium text-red-400">{error}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-text-muted">
              Teléfono <span className="text-text-muted font-normal normal-case tracking-normal">(opcional)</span>
            </label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="666 123 456"
              autoComplete="tel"
              inputMode="tel"
              className="w-full rounded-xl border border-border bg-bg-surface px-4 py-3 text-base text-text-primary placeholder:text-text-muted focus:border-brand-blue focus:outline-none"
            />
          </div>

          {/* Checkbox recordar */}
          <label className="flex cursor-pointer items-center gap-3">
            <div
              onClick={() => setRecordar((r) => !r)}
              className={[
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
                recordar ? 'border-brand-blue bg-brand-blue' : 'border-border',
              ].join(' ')}
            >
              {recordar && (
                <svg viewBox="0 0 10 8" fill="none" className="h-3 w-3">
                  <path d="M1 4l3 3 5-6" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              className="sr-only"
              checked={recordar}
              onChange={() => setRecordar((r) => !r)}
              aria-label="Recordar mis datos"
            />
            <span className="text-sm text-text-secondary">Recordar mis datos en este dispositivo</span>
          </label>

        </div>
      </main>

      {/* ── Footer fijo ─────────────────────────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t border-border bg-bg-surface px-5 py-4"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={handleSubmit}
          className="w-full rounded-2xl bg-brand-green py-4 text-sm font-bold text-bg shadow-lg shadow-brand-green/30 active:scale-[0.98] transition-transform duration-100"
        >
          Realizar pedido →
        </button>
      </div>
    </div>
  )
}
