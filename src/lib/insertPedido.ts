import { supabase } from './supabase'
import type { CartItem } from '../types'

export interface InsertPedidoArgs {
  empresa_id: string
  empresa_nombre: string
  items: CartItem[]
  notaPedido: string
  horaPedido: string
  total: number
  coste_envio: number
  cliente_nombre: string
  cliente_telefono: string
}

function buildModificaciones(item: CartItem): string | null {
  if (item.menuOpciones) {
    const opts = item.menuOpciones
    const parts: string[] = []
    if (opts.primero) parts.push(`Primero: ${opts.primero}`)
    if (opts.segundo) parts.push(`Segundo: ${opts.segundo}`)
    if (opts.postre) parts.push(`Postre: ${opts.postre}`)
    if (opts.plato) parts.push(`Plato: ${opts.plato}`)
    if (opts.bebida) parts.push(`Bebida: ${opts.bebida}`)
    if (opts.cafe) parts.push(`Café: ${opts.cafe}`)
    return parts.length > 0 ? parts.join(', ') : null
  }
  return item.nota || null
}

export async function insertPedido(args: InsertPedidoArgs): Promise<string> {
  // KDS parsea "entrega: X" de pedidos.notas para mostrar la hora
  const horaLine = `entrega: ${args.horaPedido.toLowerCase()}`
  const notasCompletas = args.notaPedido
    ? `${horaLine}\n${args.notaPedido}`
    : horaLine

  const { data: pedido, error: pedidoError } = await supabase
    .from('pedidos')
    .insert({
      cliente_nombre: args.cliente_nombre,
      cliente_telefono: args.cliente_telefono,
      empresa: args.empresa_nombre,
      empresa_id: args.empresa_id,
      hora_deseada: args.horaPedido,
      notas: notasCompletas,
      estado: 'pendiente',
      canal: 'web',
      total: args.total,
      coste_envio: args.coste_envio,
    })
    .select('id, codigo_pedido')
    .single()

  if (pedidoError || !pedido) {
    throw pedidoError ?? new Error('No se pudo crear el pedido')
  }

  const pedidoId = pedido.id as string
  const codigoPedido = pedido.codigo_pedido as string

  for (const item of args.items) {
    const extrasTotal = item.extras.reduce((s, e) => s + e.precio, 0)
    const subtotal = (item.producto.precio + extrasTotal) * item.cantidad
    const modificaciones = buildModificaciones(item)

    const { data: linea, error: lineaError } = await supabase
      .from('productos_pedido')
      .insert({
        pedido_id: pedidoId,
        nombre: item.producto.nombre,
        precio_unitario: item.producto.precio,
        cantidad: item.cantidad,
        subtotal,
        modificaciones,
      })
      .select('id')
      .single()

    if (lineaError || !linea) {
      throw lineaError ?? new Error('Error al insertar línea de pedido')
    }

    if (item.extras.length > 0) {
      const { error: extrasError } = await supabase
        .from('extras_pedido')
        .insert(
          item.extras.map((e) => ({
            producto_pedido_id: linea.id as string,
            descripcion: e.nombre,
            precio: e.precio,
          }))
        )
      if (extrasError) throw extrasError
    }

    // Bebida/café del menú como fila separada → barra la recibe por categoría
    const tipoBebida = item.menuOpciones?.bebida ?? item.menuOpciones?.cafe
    if (tipoBebida) {
      await supabase.from('productos_pedido').insert({
        pedido_id: pedidoId,
        nombre: tipoBebida,
        precio_unitario: 0,
        cantidad: item.cantidad,
        subtotal: 0,
        modificaciones: `del ${item.producto.nombre}`,
      })
    }
  }

  return codigoPedido
}
