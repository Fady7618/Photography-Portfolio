/**
 * In-memory sliding-window rate limiter for middleware.
 * Suitable for single-instance deployments. For multi-region production at scale,
 * use Upstash Redis with @upstash/ratelimit instead.
 */

type RateLimitEntry = {
  count: number
  resetAt: number
}

type RateLimitConfig = {
  limit: number
  windowMs: number
}

const store = new Map<string, RateLimitEntry>()

function cleanupExpired(now: number): void {
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) {
      store.delete(key)
    }
  }
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now()

  if (store.size > 10_000) {
    cleanupExpired(now)
  }

  const existing = store.get(key)

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + config.windowMs })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  if (existing.count >= config.limit) {
    const retryAfterSeconds = Math.ceil((existing.resetAt - now) / 1000)
    return { allowed: false, retryAfterSeconds }
  }

  existing.count += 1
  return { allowed: true, retryAfterSeconds: 0 }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? 'unknown'
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return 'unknown'
}

export const rateLimitConfigs = {
  bookings: { limit: 5, windowMs: 10 * 60 * 1000 },
  upload: { limit: 30, windowMs: 60 * 1000 },
} as const
