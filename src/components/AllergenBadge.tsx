import type { ReactNode } from 'react'

interface AllergenDef {
  label: string
  icon: ReactNode
}

const ALLERGENS: Record<string, AllergenDef> = {
  gluten: {
    label: 'Gluten',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <line x1="12" y1="22" x2="12" y2="6" />
        <ellipse cx="12" cy="4.5" rx="1.5" ry="2" fill="currentColor" stroke="none" />
        <ellipse cx="9" cy="9" rx="2.5" ry="1.2" transform="rotate(-30 9 9)" />
        <ellipse cx="15" cy="12" rx="2.5" ry="1.2" transform="rotate(30 15 12)" />
        <ellipse cx="9" cy="14.5" rx="2.5" ry="1.2" transform="rotate(-30 9 14.5)" />
        <ellipse cx="15" cy="17.5" rx="2.5" ry="1.2" transform="rotate(30 15 17.5)" />
      </svg>
    ),
  },
  crustaceos: {
    label: 'Crustáceos',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M7 17C6 14 6 10 9 8C12 6 18 7 18 11C18 15 14 18 11 17C8 16 8 13 10 12" />
        <path d="M15 7L19 4" />
        <path d="M17 8L21 6" />
        <path d="M11 17L9 21M11 17L12 21M11 17L14 20" />
      </svg>
    ),
  },
  huevos: {
    label: 'Huevos',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-full h-full">
        <path d="M12 3C8 3 6 8 6 13C6 18 9 21 12 21C15 21 18 18 18 13C18 8 16 3 12 3Z" />
      </svg>
    ),
  },
  pescado: {
    label: 'Pescado',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <ellipse cx="10" cy="12" rx="7" ry="5" />
        <path d="M16.5 9L21 7L21 17L16.5 15" />
        <circle cx="7.5" cy="11" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  cacahuetes: {
    label: 'Cacahuetes',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-full h-full">
        <path d="M8 8C8 5.2 9.8 3 12 3C14.2 3 16 5.2 16 8C16 10 14.5 11.5 13.5 12.5C14.5 13.5 16 15 16 17C16 19.8 14.2 22 12 22C9.8 22 8 19.8 8 17C8 15 9.5 13.5 10.5 12.5C9.5 11.5 8 10 8 8Z" />
        <line x1="9.5" y1="12.5" x2="14.5" y2="12.5" />
      </svg>
    ),
  },
  soja: {
    label: 'Soja',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M12 20C12 20 4 16 4 10C4 6.5 7.5 3 12 3C16.5 3 20 6.5 20 10C20 16 12 20 12 20Z" />
        <line x1="12" y1="3" x2="12" y2="20" />
        <path d="M12 10C10 8 7 9 6 11" />
        <path d="M12 10C14 8 17 9 18 11" />
      </svg>
    ),
  },
  lacteos: {
    label: 'Lácteos',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M12 3L7 12C7 16.5 9.2 21 12 21C14.8 21 17 16.5 17 12L12 3Z" />
      </svg>
    ),
  },
  frutos_cascara: {
    label: 'Frutos secos',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <ellipse cx="12" cy="15" rx="6" ry="7" />
        <path d="M12 8C12 8 10 5 12 2C14 5 12 8 12 8Z" />
        <path d="M10 14C10 12.5 10.8 11 12 11C13.2 11 14 12.5 14 14" />
      </svg>
    ),
  },
  apio: {
    label: 'Apio',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M9 21L9 11C9 8 7 5 7 5" />
        <path d="M12 21L12 9C12 6 12 3 12 3" />
        <path d="M15 21L15 11C15 8 17 5 17 5" />
        <path d="M7 5C5 4 4 6 5 8" />
        <path d="M17 5C19 4 20 6 19 8" />
        <path d="M12 3C11 1 9 2 10 4" />
      </svg>
    ),
  },
  mostaza: {
    label: 'Mostaza',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-full h-full">
        <line x1="12" y1="21" x2="12" y2="8" />
        <line x1="12" y1="12" x2="8" y2="9" />
        <line x1="12" y1="16" x2="16" y2="13" />
        <circle cx="8" cy="8" r="2" fill="currentColor" stroke="none" />
        <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none" />
        <circle cx="12" cy="7" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  sesamo: {
    label: 'Sésamo',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-full h-full">
        <ellipse cx="12" cy="13" rx="4.5" ry="8" />
        <line x1="12" y1="5" x2="12" y2="3" />
        <ellipse cx="12" cy="8.5" rx="1.5" ry="1" fill="currentColor" stroke="none" />
        <ellipse cx="12" cy="12.5" rx="1.5" ry="1" fill="currentColor" stroke="none" />
        <ellipse cx="12" cy="16.5" rx="1.5" ry="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  sulfitos: {
    label: 'Sulfitos',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M7 3C7 3 6 11 12 12C18 11 17 3 17 3" />
        <line x1="12" y1="12" x2="12" y2="19" />
        <line x1="8" y1="19" x2="16" y2="19" />
      </svg>
    ),
  },
  altramuces: {
    label: 'Altramuces',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <ellipse cx="12" cy="15" rx="5" ry="7" />
        <ellipse cx="12" cy="8.5" rx="2" ry="3" fill="currentColor" stroke="none" />
        <circle cx="8" cy="13" r="1.8" />
        <circle cx="16" cy="13" r="1.8" />
        <circle cx="8" cy="18" r="1.8" />
        <circle cx="16" cy="18" r="1.8" />
      </svg>
    ),
  },
  moluscos: {
    label: 'Moluscos',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M9 4C9 3 15 3 15 4" />
        <path d="M9 4L5 18" />
        <path d="M10.5 3.5L8.5 19" />
        <path d="M12 3.5L12 21" />
        <path d="M13.5 3.5L15.5 19" />
        <path d="M15 4L19 18" />
        <path d="M5 18C7 22 17 22 19 18" />
      </svg>
    ),
  },
}

interface Props {
  slug: string
}

export function AllergenBadge({ slug }: Props) {
  const data = ALLERGENS[slug]
  if (!data) return null

  return (
    <div className="flex flex-col items-center gap-1.5 w-14">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-800 p-2.5 border border-amber-200">
        {data.icon}
      </div>
      <span className="text-[9px] font-semibold text-text-muted leading-tight text-center w-full">
        {data.label}
      </span>
    </div>
  )
}

export { ALLERGENS }
