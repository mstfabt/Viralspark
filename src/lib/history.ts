export type HistoryItem = {
  id: string
  prompt: string
  platforms: string[]
  results: Record<string, { text: string; score: number; tip: string | null }>
  createdAt: string
}

const STORAGE_KEY = 'viralspark_history'
const MAX_ITEMS = 50

export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveToHistory(item: Omit<HistoryItem, 'id' | 'createdAt'>) {
  const history = getHistory()
  const newItem: HistoryItem = {
    ...item,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    createdAt: new Date().toISOString(),
  }
  history.unshift(newItem)
  if (history.length > MAX_ITEMS) history.length = MAX_ITEMS
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  return newItem
}

export function deleteFromHistory(id: string) {
  const history = getHistory().filter((h) => h.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY)
}
