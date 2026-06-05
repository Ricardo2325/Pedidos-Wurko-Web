import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartBar() {
  const { count, total } = useCart()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Oculto si el carrito está vacío
  if (count === 0) return null

  const token = searchParams.get('empresa') ?? ''

  function handleClick() {
    navigate(`/carrito?empresa=${token}`)
  }

  return (
    // position:fixed + safe-area-inset-bottom para iPhone con notch/home indicator
    <div
      className="fixed bottom-0 left-0 right-0 z-40 px-4"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <button
        onClick={handleClick}
        className="flex w-full items-center justify-between rounded-2xl bg-brand-blue px-5 py-4 shadow-2xl shadow-brand-blue/40 active:scale-[0.97] transition-transform duration-100"
        aria-label={`Ver pedido: ${count} producto${count !== 1 ? 's' : ''}, total ${total.toFixed(2)} euros`}
      >
        {/* Contador */}
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-sm font-bold text-white">
          {count}
        </span>

        {/* Texto central */}
        <span className="flex-1 text-center text-sm font-bold tracking-wide text-white">
          🛒 Ver pedido
        </span>

        {/* Total */}
        <span className="text-sm font-extrabold text-brand-green tabular-nums">
          {total.toFixed(2)}€
        </span>
      </button>
    </div>
  )
}
