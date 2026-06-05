import { useRef, useEffect } from 'react'

interface Props {
  categories: string[]
  active: string
  onSelect: (cat: string) => void
}

export default function CategoryTabs({ categories, active, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)

  // Scroll al tab activo cuando cambia la categoría
  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [active])

  return (
    <div
      ref={containerRef}
      className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-3"
      role="tablist"
      aria-label="Categorías de la carta"
    >
      {categories.map((cat) => {
        const isActive = cat === active
        return (
          <button
            key={cat}
            ref={isActive ? activeRef : null}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(cat)}
            className={[
              'flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200',
              isActive
                ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30'
                : 'bg-bg-elevated text-text-secondary border border-border',
            ].join(' ')}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
