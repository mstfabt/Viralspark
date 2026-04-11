// Shared input validation and sanitization helpers

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VALID_PLATFORMS = ['twitter', 'instagram', 'linkedin', 'tiktok'] as const
const VALID_LANGS = ['tr', 'en'] as const

/** Strip HTML tags and trim whitespace */
export function sanitize(input: unknown): string {
  if (typeof input !== 'string') return ''
  return input.trim().replace(/<[^>]*>/g, '')
}

/** Validate email format */
export function isValidEmail(email: unknown): email is string {
  return typeof email === 'string' && EMAIL_REGEX.test(email.trim())
}

/** Validate string with max length */
export function validateString(
  value: unknown,
  maxLength: number
): { valid: true; value: string } | { valid: false; error: string } {
  if (typeof value !== 'string' || !value.trim()) {
    return { valid: false, error: 'Required field is missing or not a string.' }
  }
  const sanitized = sanitize(value)
  if (sanitized.length === 0) {
    return { valid: false, error: 'Field is empty after sanitization.' }
  }
  if (sanitized.length > maxLength) {
    return { valid: false, error: `Field exceeds maximum length of ${maxLength} characters.` }
  }
  return { valid: true, value: sanitized }
}

/** Validate platform enum */
export function validatePlatform(value: unknown): value is string {
  return typeof value === 'string' && VALID_PLATFORMS.includes(value as typeof VALID_PLATFORMS[number])
}

/** Validate platform array — each item must be a valid platform */
export function validatePlatforms(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every(validatePlatform)
}

/** Validate lang enum */
export function validateLang(value: unknown): value is string {
  return typeof value === 'string' && VALID_LANGS.includes(value as typeof VALID_LANGS[number])
}

/** Validate number within range */
export function validateNumber(
  value: unknown,
  min: number,
  max: number
): { valid: true; value: number } | { valid: false; error: string } {
  const num = typeof value === 'string' ? parseInt(value, 10) : value
  if (typeof num !== 'number' || isNaN(num)) {
    return { valid: false, error: 'Must be a number.' }
  }
  if (num < min || num > max) {
    return { valid: false, error: `Must be between ${min} and ${max}.` }
  }
  return { valid: true, value: num }
}

/** IP-based rate limiter (for unauthenticated endpoints like /lead) */
const ipRequests = new Map<string, { count: number; resetAt: number }>()

export function rateLimitByIP(ip: string, limit = 3, windowMs = 60_000): boolean {
  const now = Date.now()
  const entry = ipRequests.get(ip)

  if (!entry || now > entry.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) {
    return false
  }

  entry.count++
  return true
}

// Clean up old entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, val] of ipRequests) {
      if (now > val.resetAt) ipRequests.delete(key)
    }
  }, 300_000)
}
