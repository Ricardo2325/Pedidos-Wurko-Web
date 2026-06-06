import { useState, useCallback } from 'react'

const LS_KEY = 'wurko_favoritos'

function loadFromStorage(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? new Set<string>(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveToStorage(set: Set<string>) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify([...set]))
  } catch { /* sin acceso a localStorage */ }
}

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<Set<string>>(loadFromStorage)

  const isFavorito = useCallback((id: string) => favoritos.has(id), [favoritos])

  const toggleFavorito = useCallback((id: string) => {
    setFavoritos((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      saveToStorage(next)
      return next
    })
  }, [])

  return { favoritos, isFavorito, toggleFavorito }
}
