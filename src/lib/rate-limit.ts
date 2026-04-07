const requests = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(userId: string, limit = 20, windowMs = 60_000): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = requests.get(userId)

  if (!entry || now > entry.resetAt) {
    requests.set(userId, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: limit - entry.count }
}

// Clean up old entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, val] of requests) {
      if (now > val.resetAt) requests.delete(key)
    }
  }, 300_000)
}
