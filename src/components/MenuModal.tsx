import { useState, useMemo } from 'react'
import ModalBase from './ModalBase'
import { useCart } from '../context/CartContext'
import type { Producto } from '../types'
import type { MenuDiaData } from '../hooks/useMenuDia'

interface Props {
  producto: Producto | null
  menuDia: MenuDiaData
  bebidas: Producto[]
  cafes: Producto[]
  onClose: () => void
  onAdded: () => void
}

function RadioPill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full rounded-xl px-4 py-3 text-left text-sm transition-colors active:scale-[0.98]',
        selected
          ? 'bg-brand-blue font-semibold text-white'
          : 'border border-border/60 bg-bg-elevated font-normal text-text-primary',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

function Section({
  title, options, value, onChange,
}: {
  title: string; options: string[]; value: string; onChange: (v: string) => void
}) {
  if (options.length === 0) return null
  return (
    <div>
      <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-text-muted">{title}</p>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <RadioPill
            key={opt}
            label={opt}
            selected={value === opt}
            onClick={() => onChange(value === opt ? '' : opt)}
          />
        ))}
      </div>
    </div>
  )
}

export default function MenuModal({ producto, menuDia, bebidas, cafes, onClose, onAdded }: Props) {
  const { addItem } = useCart()

  const [primero, setPrimero] = useState('')
  const [segundo, setSegundo] = useState('')
  const [postre, setPostre] = useState('')
  const [plato, setPlato] = useState('')
  const [bebida, setBebida] = useState('')
  const [cafe, setCafe] = useState('')

  const tipo = producto?.tipo ?? ''

  const isComplete = useMemo(() => {
    switch (tipo) {
      case 'menu_completo':            return !!primero && !!segundo && !!postre && !!bebida
      case 'medio_menu':               return !!plato && !!bebida
      case 'menu_desayuno':
      case 'menu_desayuno_especial':   return !!cafe
      default:                         return false
    }
  }, [tipo, primero, segundo, postre, bebida, plato, cafe])

  function handleAdd() {
    if (!producto || !isComplete) return

    // Línea del menú con modificaciones
    addItem({
      id: crypto.randomUUID(),
      producto,
      cantidad: 1,
      extras: [],
      nota: '',
      menuOpciones: {
        primero: primero || undefined,
        segundo: segundo || undefined,
        postre: postre || undefined,
        bebida: bebida || undefined,
        plato: plato || undefined,
        cafe: cafe || undefined,
      },
    })

    // Bebida como línea separada para la tablet de barra (precio 0)
    if (bebida && (tipo === 'menu_completo' || tipo === 'medio_menu')) {
      const bebidaProducto = bebidas.find((b) => b.nombre === bebida)
      if (bebidaProducto) {
        addItem({
          id: crypto.randomUUID(),
          producto: { ...bebidaProducto, precio: 0 },
          cantidad: 1,
          extras: [],
          nota: '',
          menuOpciones: { bebida: `del ${producto.nombre}` },
        })
      }
    }

    setPrimero(''); setSegundo(''); setPostre('')
    setPlato(''); setBebida(''); setCafe('')
    onAdded()
  }

  return (
    <ModalBase
      open={!!producto}
      onClose={onClose}
      title={producto?.nombre ?? ''}
      subtitle={producto ? `${producto.precio.toFixed(2)}€` : ''}
    >
      <div className="flex flex-col gap-5 px-5 py-4 pb-32">

        {tipo === 'menu_completo' && (
          <>
            <Section title="Primer plato"  options={menuDia.primeros}                        value={primero} onChange={setPrimero} />
            <Section title="Segundo plato" options={menuDia.segundos}                        value={segundo} onChange={setSegundo} />
            <Section title="Postre"        options={menuDia.postres}                         value={postre}  onChange={setPostre}  />
            <Section title="Bebida"        options={bebidas.map((b) => b.nombre)}            value={bebida}  onChange={setBebida}  />
          </>
        )}

        {tipo === 'medio_menu' && (
          <>
            <Section title="Elige tu plato" options={[...menuDia.primeros, ...menuDia.segundos]} value={plato}  onChange={setPlato}  />
            <Section title="Bebida"         options={bebidas.map((b) => b.nombre)}              value={bebida} onChange={setBebida} />
          </>
        )}

        {tipo === 'menu_desayuno_especial' && menuDia.pulguita && (
          <div className="rounded-xl border border-brand-green/30 bg-brand-green/10 px-4 py-3">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-brand-green">
              Pulguita del día
            </p>
            <p className="text-sm font-medium text-text-primary">{menuDia.pulguita}</p>
          </div>
        )}

        {(tipo === 'menu_desayuno' || tipo === 'menu_desayuno_especial') && (
          <Section title="Bebida del desayuno" options={cafes.map((c) => c.nombre)} value={cafe} onChange={setCafe} />
        )}
      </div>

      {/* Botón fijo */}
      <div
        className="absolute bottom-0 left-0 right-0 border-t border-border bg-bg-surface px-5 py-4"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={handleAdd}
          disabled={!isComplete}
          className={[
            'w-full rounded-2xl py-4 text-sm font-bold shadow-lg transition-all duration-100 active:scale-[0.98]',
            isComplete
              ? 'bg-brand-green text-bg shadow-brand-green/30'
              : 'cursor-not-allowed bg-bg-elevated text-text-muted',
          ].join(' ')}
        >
          {isComplete
            ? `Añadir al pedido · ${producto?.precio.toFixed(2)}€`
            : 'Completa todas las opciones'}
        </button>
      </div>
    </ModalBase>
  )
}
