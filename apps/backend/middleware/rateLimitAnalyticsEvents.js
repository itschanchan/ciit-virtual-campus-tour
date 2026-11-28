// Zero-dependency, in-memory rate limiter for public analytics ingestion.
// Keys live only in process memory and are never written to the database.

const DEFAULT_LIMIT = 60
const DEFAULT_WINDOW_MS = 60 * 1000

function getClientKey(req) {
  // Express only trusts X-Forwarded-For when `trust proxy` is configured.
  // This app does not configure it, so req.ip is the socket address.
  return req.ip ?? req.socket?.remoteAddress ?? 'unknown'
}

export function createRateLimiter({ limit = DEFAULT_LIMIT, windowMs = DEFAULT_WINDOW_MS } = {}) {
  const hits = new Map()
  let nextCleanupAt = 0

  function removeExpiredEntries(now) {
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) {
        hits.delete(key)
      }
    }

    nextCleanupAt = now + windowMs
  }

  return function rateLimit(req, res, next) {
    const now = Date.now()

    if (now >= nextCleanupAt) {
      removeExpiredEntries(now)
    }

    const key = getClientKey(req)
    const entry = hits.get(key)

    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs })
      return next()
    }

    if (entry.count >= limit) {
      const retryAfterSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000))
      res.set('Retry-After', String(retryAfterSeconds))
      return res.status(429).json({
        error: {
          code: 'RATE_LIMITED',
          message: 'Too many analytics events. Please try again later.',
        },
      })
    }

    entry.count += 1
    return next()
  }
}

export const rateLimitAnalyticsEvents = createRateLimiter()

export default rateLimitAnalyticsEvents
