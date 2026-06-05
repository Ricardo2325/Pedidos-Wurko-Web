import { useSearchParams } from 'react-router-dom'
import { useEmpresa } from '../hooks/useEmpresa'
import EmpresaError from '../components/EmpresaError'
import LoadingScreen from '../components/LoadingScreen'

export default function Pedido() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('empresa')
  const state = useEmpresa(token)

  if (state.status === 'loading') {
    return <LoadingScreen />
  }

  if (state.status === 'error') {
    return <EmpresaError message={state.message} />
  }

  const { empresa } = state

  // Tarea 3 → aquí irá la carta completa
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6">
      <div className="text-center">
        {/* Badge empresa */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-blue/10 border border-brand-blue/30 px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-brand-green animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-blue">
            {empresa.nombre}
          </span>
        </div>

        {/* Logo */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-bg-surface border border-brand-blue/20">
            <span className="text-4xl">🏓</span>
          </div>
        </div>

        <h1 className="font-display text-3xl font-extrabold tracking-tight text-text-primary">
          WURKO <span className="text-brand-green">PADEL</span>
        </h1>
        <p className="mt-1 text-sm font-medium text-text-secondary">Cafetería · Pedidos online</p>

        {/* Info envío */}
        <div className="mt-6 rounded-xl bg-bg-surface border border-border px-5 py-3 text-xs text-text-muted">
          {empresa.envio_gratis
            ? '✅ Envío gratuito para tu empresa'
            : `🛵 Coste de envío: ${empresa.coste_envio.toFixed(2)}€`}
        </div>

        <p className="mt-8 text-xs text-text-muted">
          Tarea 3 → carta de productos próximamente
        </p>
      </div>
    </div>
  )
}
