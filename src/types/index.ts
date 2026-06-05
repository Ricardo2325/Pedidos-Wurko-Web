export interface Empresa {
  id: string
  nombre: string
  token_acceso: string
  envio_gratis: boolean
  coste_envio: number
  activa: boolean
}

export interface Producto {
  id: string
  nombre: string
  categoria: string
  precio: number
  activo: boolean
  descripcion: string | null
  foto_url: string | null
  tipo: 'normal' | 'menu_completo' | 'medio_menu' | 'menu_desayuno' | 'menu_desayuno_especial'
  orden: number
}

export interface MenuDia {
  id: string
  tipo: 'Primero' | 'Segundo' | 'Postre' | 'Pulguita_especial'
  descripcion: string
}

export interface CartItem {
  id: string               // UUID único por línea de carrito
  producto: Producto
  cantidad: number
  extras: CartExtra[]
  nota: string
  // Para menús: opciones elegidas
  menuOpciones?: {
    primero?: string
    segundo?: string
    postre?: string
    bebida?: string
    plato?: string         // para medio menú
    cafe?: string          // para menús desayuno
  }
}

export interface CartExtra {
  id: string
  nombre: string
  precio: number
}

export interface PedidoInsert {
  cliente_nombre: string
  cliente_telefono: string
  empresa: string
  empresa_id: string
  hora_deseada: string
  notas: string
  estado: 'pendiente'
  canal: 'web'
  total: number
  coste_envio: number
}
