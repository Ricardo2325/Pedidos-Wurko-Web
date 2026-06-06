import type { CartItem } from '../types'

const LS_KEY = 'wurko_last_order'
const TIPOS_MENU = ['menu_completo', 'medio_menu', 'menu_desayuno', 'menu_desayuno_especial']

interface LastOrder {
  items: CartItem[]
  date: string
  empresaToken: string
}

export function saveLastOrder(items: CartItem[], empresaToken: string) {
  const nonMenuItems = items.filter((i) => !TIPOS_MENU.includes(i.producto.tipo))
  if (nonMenuItems.length === 0) return
  try {
    const data: LastOrder = {
      items: nonMenuItems,
      date: new Date().toISOString().slice(0, 10),
      empresaToken,
    }
    localStorage.setItem(LS_KEY, JSON.stringify(data))
  } catch {}
}

export function getLastOrder(empresaToken: string): CartItem[] | null {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    const data: LastOrder = JSON.parse(raw)
    if (data.empresaToken !== empresaToken) return null
    return data.items.length > 0 ? data.items : null
  } catch {
    return null
  }
}
