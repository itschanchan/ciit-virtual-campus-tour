import request from 'supertest'
import { afterEach, describe, expect, it, vi } from 'vitest'

const analyticsState = vi.hoisted(() => ({
  recordEvent: async () => ({ created: true }),
  getSummary: async () => ({ range: 'today' }),
}))

vi.mock('../services/AnalyticsService.js', () => ({
  __esModule: true,
  default: {
    recordEvent: (...args) => analyticsState.recordEvent(...args),
    getSummary: (...args) => analyticsState.getSummary(...args),
  },
}))

const authState = vi.hoisted(() => ({
  getSessionUser: async () => ({ id: 'admin-1', username: 'admin' }),
}))

vi.mock('../services/AuthService.js', () => ({
  __esModule: true,
  default: {
    login: async () => {
      throw new Error('Not used in analytics tests.')
    },
    register: async () => ({}),
    refreshAccessToken: async () => ({ accessToken: 'token' }),
    getSessionUser: (...args) => authState.getSessionUser(...args),
    logout: async () => {},
  },
}))

vi.mock('../models/Admins.js', () => ({
  __esModule: true,
  default: {
    exists: async () => true,
  },
}))

import { createRateLimiter } from '../middleware/rateLimitAnalyticsEvents.js'
import app from '../index.js'

const pageViewEvent = {
  eventId: 'page_view:s_ab12cd34:ld_9f8e',
  type: 'page_view',
  sessionId: 's_ab12cd34',
  path: '/',
}

function createRequest(ip) {
  return { ip, socket: { remoteAddress: ip } }
}

function createResponse() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    set(name, value) {
      res.headers[name] = value
      return res
    },
    status(code) {
      res.statusCode = code
      return res
    },
    json(payload) {
      res.body = payload
      return res
    },
  }

  return res
}

describe('createRateLimiter', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('allows requests up to the limit and rejects the next one', () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 60000 })
    const req = createRequest('203.0.113.10')
    const next = vi.fn()

    limiter(req, createResponse(), next)
    limiter(req, createResponse(), next)

    const res = createResponse()
    limiter(req, res, next)

    expect(next).toHaveBeenCalledTimes(2)
    expect(res.statusCode).toBe(429)
    expect(res.body).toMatchObject({ error: { code: 'RATE_LIMITED' } })
    expect(res.headers['Retry-After']).toBe('60')
  })

  it('counts separate client IPs independently', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60000 })
    const next = vi.fn()

    limiter(createRequest('203.0.113.10'), createResponse(), next)
    limiter(createRequest('203.0.113.10'), createResponse(), next)

    const otherClientRes = createResponse()
    limiter(createRequest('198.51.100.7'), otherClientRes, next)

    expect(next).toHaveBeenCalledTimes(2)
    expect(otherClientRes.statusCode).toBe(200)
  })

  it('allows requests again after the window expires', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-11-27T00:00:00.000Z'))

    const limiter = createRateLimiter({ limit: 1, windowMs: 60000 })
    const req = createRequest('203.0.113.10')
    const next = vi.fn()

    limiter(req, createResponse(), next)
    limiter(req, createResponse(), next)

    vi.setSystemTime(new Date('2026-11-27T00:01:00.001Z'))
    limiter(req, createResponse(), next)

    expect(next).toHaveBeenCalledTimes(2)
  })
})

describe('POST /api/analytics/events rate limiting', () => {
  it('returns 429 after 60 events from one IP and keeps summary available', async () => {
    for (let index = 0; index < 60; index += 1) {
      await request(app).post('/api/analytics/events').send(pageViewEvent).expect(204)
    }

    const limited = await request(app)
      .post('/api/analytics/events')
      .send(pageViewEvent)
      .expect(429)

    expect(limited.body).toMatchObject({ error: { code: 'RATE_LIMITED' } })
    expect(limited.headers['retry-after']).toBeDefined()

    await request(app)
      .get('/api/analytics/summary?range=today')
      .set('Cookie', ['refreshToken=valid-admin-token'])
      .expect(200)
  })
})
