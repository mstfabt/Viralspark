// localStorage-based favorites system

const FAVORITES_KEY = 'vs_favorites'

export type FavoriteItem = {
  id: string
  content: string
  platform: string
  topic: string
  score?: number
  savedAt: string
}

export function getFavorites(): FavoriteItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addFavorite(item: Omit<FavoriteItem, 'id' | 'savedAt'>): FavoriteItem {
  const favorites = getFavorites()
  const newItem: FavoriteItem = {
    ...item,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    savedAt: new Date().toISOString(),
  }
  favorites.unshift(newItem)
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  return newItem
}

export function removeFavorite(id: string): void {
  const favorites = getFavorites().filter((f) => f.id !== id)
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

export function isFavorite(content: string): boolean {
  const favorites = getFavorites()
  return favorites.some((f) => f.content === content)
}
