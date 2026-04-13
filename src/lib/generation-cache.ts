import { useState, useEffect, useCallback } from 'react'

const CACHE_PREFIX = 'vs_gen_'
const MAX_AGE_MS = 24 * 60 * 60 * 1000 // 24 hours

type CacheEntry<T> = {
  data: T
  input: string
  timestamp: number
}

function readCache<T>(key: string): CacheEntry<T> | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const entry: CacheEntry<T> = JSON.parse(raw)
    if (Date.now() - entry.timestamp > MAX_AGE_MS) {
      localStorage.removeItem(CACHE_PREFIX + key)
      return null
    }
    return entry
  } catch {
    return null
  }
}

function writeCache<T>(key: string, data: T, input: string) {
  try {
    const entry: CacheEntry<T> = { data, input, timestamp: Date.now() }
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry))
  } catch {
    // localStorage full or unavailable
  }
}

export function useGenerationCache<T>(toolKey: string) {
  const [cachedResult, setCachedResult] = useState<T | null>(null)
  const [cachedInput, setCachedInput] = useState<string>('')

  useEffect(() => {
    const entry = readCache<T>(toolKey)
    if (entry) {
      setCachedResult(entry.data)
      setCachedInput(entry.input)
    }
  }, [toolKey])

  const saveResult = useCallback(
    (data: T, input: string) => {
      writeCache(toolKey, data, input)
      setCachedResult(data)
      setCachedInput(input)
    },
    [toolKey],
  )

  const clearResult = useCallback(() => {
    localStorage.removeItem(CACHE_PREFIX + toolKey)
    setCachedResult(null)
    setCachedInput('')
  }, [toolKey])

  return { cachedResult, cachedInput, saveResult, clearResult }
}
