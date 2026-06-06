import { createContext, useContext, useReducer, useMemo, useEffect, type ReactNode } from 'react'
import type { CartItem, CartExtra, Producto } from '../types'

// ─── Types ───────────────────────────────────────────────────────────────────

interface CartState {
  items: CartItem[]
  notaPedido: string
  horaPedido: string
}

type Action =
  | { type: 'ADD_SIMPLE'; product: Producto }
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'UPDATE_QUANTITY'; id: string; delta: number }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'SET_NOTA'; nota: string }
  | { type: 'SET_HORA'; hora: string }
  | { type: 'CLEAR' }

interface CartContextType {
  items: CartItem[]
  addSimple: (product: Producto) => void
  addItem: (item: CartItem) => void
  updateQuantity: (id: string, delta: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  notaPedido: string
  setNotaPedido: (nota: string) => void
  horaPedido: string
  setHoraPedido: (hora: string) => void
  total: number
  count: number
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

function itemSubtotal(item: CartItem): number {
  const extrasTotal = item.extras.reduce((s, e: CartExtra) => s + e.precio, 0)
  return (item.producto.precio + extrasTotal) * item.cantidad
}

const INITIAL_STATE: CartState = {
  items: [],
  notaPedido: '',
  horaPedido: 'Lo antes posible',
}

const LS_KEY = 'wurko_cart'

function loadFromStorage(): CartState {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return INITIAL_STATE
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.items)) return INITIAL_STATE
    return {
      items: parsed.items,
      notaPedido: typeof parsed.notaPedido === 'string' ? parsed.notaPedido : '',
      horaPedido: typeof parsed.horaPedido === 'string' ? parsed.horaPedido : 'Lo antes posible',
    }
  } catch {
    return INITIAL_STATE
  }
}

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'ADD_SIMPLE': {
      // Agrupa con línea existente si mismo producto, sin extras, sin nota, sin menú
      const existing = state.items.find(
        (i) =>
          i.producto.id === action.product.id &&
          i.extras.length === 0 &&
          i.nota === '' &&
          !i.menuOpciones,
      )
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === existing.id ? { ...i, cantidad: i.cantidad + 1 } : i,
          ),
        }
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: crypto.randomUUID(),
            producto: action.product,
            cantidad: 1,
            extras: [],
            nota: '',
          },
        ],
      }
    }

    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.item] }

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.id === action.id ? { ...i, cantidad: i.cantidad + action.delta } : i,
          )
          .filter((i) => i.cantidad > 0),
      }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) }

    case 'SET_NOTA':
      return { ...state, notaPedido: action.nota }

    case 'SET_HORA':
      return { ...state, horaPedido: action.hora }

    case 'CLEAR':
      return INITIAL_STATE

    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, INITIAL_STATE, loadFromStorage)

  useEffect(() => {
    try {
      if (state.items.length === 0 && !state.notaPedido) {
        localStorage.removeItem(LS_KEY)
      } else {
        localStorage.setItem(LS_KEY, JSON.stringify(state))
      }
    } catch { /* sin acceso a localStorage */ }
  }, [state])

  const total = useMemo(
    () => state.items.reduce((s, i) => s + itemSubtotal(i), 0),
    [state.items],
  )

  const count = useMemo(
    () => state.items.reduce((s, i) => s + i.cantidad, 0),
    [state.items],
  )

  const value: CartContextType = {
    items: state.items,
    addSimple: (product) => dispatch({ type: 'ADD_SIMPLE', product }),
    addItem: (item) => dispatch({ type: 'ADD_ITEM', item }),
    updateQuantity: (id, delta) => dispatch({ type: 'UPDATE_QUANTITY', id, delta }),
    removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', id }),
    clearCart: () => dispatch({ type: 'CLEAR' }),
    notaPedido: state.notaPedido,
    setNotaPedido: (nota) => dispatch({ type: 'SET_NOTA', nota }),
    horaPedido: state.horaPedido,
    setHoraPedido: (hora) => dispatch({ type: 'SET_HORA', hora }),
    total,
    count,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}
