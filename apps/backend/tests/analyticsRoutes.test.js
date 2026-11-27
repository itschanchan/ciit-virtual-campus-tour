import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const analyticsState = vi.hoisted(() => ({
  recordEvent: async () => ({ created: true }),
  getSummary: async () => null,
}))

vi.mock('../services/AnalyticsService.js', () => ({
  __esModule: true,
  default: {
    recordEvent: (...args) => analyticsState.recordEvent(...args),
    getSummary: (...args) => analyticsState.getSummary(...args),
  },
}))

const authState = vi.hoisted(() => ({
  getSessionUser: async () => null,
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

const adminModelState = vi.hoisted(() => ({
  exists: async () => true,
}))

vi.mock('../models/Admins.js', () => ({
  __esModule: true,
  default: {
    exists: (...args) => adminModelState.exists(...args),
  },
}))

import app from '../index.js'

const pageViewEvent = {
  eventId: 'page_view:s_ab12cd34:ld_9f8e',
  type: 'page_view',
  sessionId: 's_ab12cd34',
  path: '/',
}

const adminUser = { id: 'admin-1', username: 'admin', role: 'admin' }

const summaryFixture = {
  range: 'today',
  timezone: 'Asia/Manila',
  start: '2026-11-26T16:00:00.000Z',
  end: '2026-11-27T16:00:00.000Z',
  totals: { pageViews: 3, uniqueVisitors: 2, tourStarts: 1, floorVisits: 4 },
  floors: [{ floor: 'LG', visits: 4 }],
  locations: [{ locationId: 'glitch-tower-lobby', visits: 2 }],
  mostVisitedFloor: 'LG',
}

function createAuthError(name = 'JsonWebTokenError', message = 'invalid token') {
  const error = new Error(message)
  error.name = name
  return error
}

describe('Analytics routes', () => {
  beforeEach(() => {
    authState.getSessionUser = vi.fn(async () => null)
    adminModelState.exists = vi.fn(async () => true)
    analyticsState.recordEvent = vi.fn(async () => ({ created: true }))
    analyticsState.getSummary = vi.fn(async (range) => ({ ...summaryFixture, range }))
  })

  it('stores a valid public event', async () => {
    await request(app).post('/api/analytics/events').send(pageViewEvent).expect(204)

    expect(analyticsState.recordEvent).toHaveBeenCalledTimes(1)
    expect(analyticsState.recordEvent.mock.calls[0][0]).toMatchObject({
      eventId: pageViewEvent.eventId,
      type: 'page_view',
      sessionId: 's_ab12cd34',
      path: '/',
    })
  })

  it('stores a floor_view with an optional location', async () => {
    const floorEvent = {
      eventId: 'floor_view:s_ab12cd34:ld_9f8e:1',
      type: 'floor_view',
      sessionId: 's_ab12cd34',
      floor: 'LG',
      locationId: 'glitch-tower-lobby',
      sceneId: '0-lg---1',
    }

    await request(app).post('/api/analytics/events').send(floorEvent).expect(204)

    expect(analyticsState.recordEvent).toHaveBeenCalledWith({
      eventId: floorEvent.eventId,
      type: 'floor_view',
      sessionId: 's_ab12cd34',
      path: null,
      floor: 'LG',
      locationId: 'glitch-tower-lobby',
      sceneId: '0-lg---1',
    })
  })

  it('rejects a floor_view with an invalid location', async () => {
    const response = await request(app)
      .post('/api/analytics/events')
      .send({
        eventId: 'floor_view:s_ab12cd34:ld_9f8e:2',
        type: 'floor_view',
        sessionId: 's_ab12cd34',
        floor: 'LG',
        locationId: 'Glitch Tower',
      })
      .expect(400)

    expect(response.body.error.message).toContain('locationId')
    expect(analyticsState.recordEvent).not.toHaveBeenCalled()
  })

  it('rejects malformed events', async () => {
    const response = await request(app)
      .post('/api/analytics/events')
      .send({ ...pageViewEvent, type: 'session_end' })
      .expect(400)

    expect(response.body).toMatchObject({ error: { code: 'INVALID_EVENT' } })
    expect(analyticsState.recordEvent).not.toHaveBeenCalled()
  })

  it('rejects unexpected event fields', async () => {
    const response = await request(app)
      .post('/api/analytics/events')
      .send({ ...pageViewEvent, floor: 'LG' })
      .expect(400)

    expect(response.body.error.message).toContain('Unexpected field')
    expect(analyticsState.recordEvent).not.toHaveBeenCalled()
  })

  it('acknowledges duplicate event IDs without a second record', async () => {
    analyticsState.recordEvent = vi.fn(async () => ({ created: false }))

    await request(app).post('/api/analytics/events').send(pageViewEvent).expect(204)

    expect(analyticsState.recordEvent).toHaveBeenCalledTimes(1)
  })

  it('suppresses events from a verified administrator session', async () => {
    authState.getSessionUser = vi.fn(async () => adminUser)

    await request(app)
      .post('/api/analytics/events')
      .set('Cookie', ['refreshToken=valid-admin-token'])
      .send(pageViewEvent)
      .expect(204)

    expect(authState.getSessionUser).toHaveBeenCalledWith('valid-admin-token')
    expect(analyticsState.recordEvent).not.toHaveBeenCalled()
  })

  it('still tracks events when the admin cookie is invalid', async () => {
    authState.getSessionUser = vi.fn(async () => {
      throw new Error('Invalid or expired refresh token')
    })

    await request(app)
      .post('/api/analytics/events')
      .set('Cookie', ['refreshToken=stale-token'])
      .send(pageViewEvent)
      .expect(204)

    expect(analyticsState.recordEvent).toHaveBeenCalledTimes(1)
  })

  it('rejects summary requests without a session cookie', async () => {
    const response = await request(app).get('/api/analytics/summary?range=today').expect(401)

    expect(response.body).toMatchObject({ error: { code: 'UNAUTHORIZED' } })
    expect(analyticsState.getSummary).not.toHaveBeenCalled()
  })

  it('rejects summary requests with an invalid session cookie', async () => {
    authState.getSessionUser = vi.fn(async () => {
      throw createAuthError()
    })

    await request(app)
      .get('/api/analytics/summary?range=today')
      .set('Cookie', ['refreshToken=stale-token'])
      .expect(401)

    expect(analyticsState.getSummary).not.toHaveBeenCalled()
  })

  it('rejects summary requests with an expired session cookie', async () => {
    authState.getSessionUser = vi.fn(async () => {
      throw createAuthError('TokenExpiredError', 'jwt expired')
    })

    await request(app)
      .get('/api/analytics/summary?range=today')
      .set('Cookie', ['refreshToken=expired-token'])
      .expect(401)

    expect(analyticsState.getSummary).not.toHaveBeenCalled()
  })

  it('rejects summary requests for a deactivated administrator', async () => {
    authState.getSessionUser = vi.fn(async () => adminUser)
    adminModelState.exists = vi.fn(async () => false)

    const response = await request(app)
      .get('/api/analytics/summary?range=today')
      .set('Cookie', ['refreshToken=valid-admin-token'])
      .expect(401)

    expect(response.body).toMatchObject({ error: { code: 'UNAUTHORIZED' } })
    expect(adminModelState.exists).toHaveBeenCalledWith({ _id: 'admin-1', is_active: true })
    expect(analyticsState.getSummary).not.toHaveBeenCalled()
  })

  it('returns 500 when the session store is unavailable', async () => {
    authState.getSessionUser = vi.fn(async () => {
      throw new Error('connection closed')
    })

    const response = await request(app)
      .get('/api/analytics/summary?range=today')
      .set('Cookie', ['refreshToken=valid-admin-token'])
      .expect(500)

    expect(response.body).toMatchObject({ error: { code: 'ANALYTICS_AUTH_FAILED' } })
    expect(analyticsState.getSummary).not.toHaveBeenCalled()
  })

  it('returns 500 when the administrator lookup fails', async () => {
    authState.getSessionUser = vi.fn(async () => adminUser)
    adminModelState.exists = vi.fn(async () => {
      throw new Error('database offline')
    })

    const response = await request(app)
      .get('/api/analytics/summary?range=today')
      .set('Cookie', ['refreshToken=valid-admin-token'])
      .expect(500)

    expect(response.body).toMatchObject({ error: { code: 'ANALYTICS_AUTH_FAILED' } })
    expect(analyticsState.getSummary).not.toHaveBeenCalled()
  })

  it('rejects summary requests when the session has no admin', async () => {
    authState.getSessionUser = vi.fn(async () => null)

    await request(app)
      .get('/api/analytics/summary?range=today')
      .set('Cookie', ['refreshToken=empty-session'])
      .expect(401)

    expect(analyticsState.getSummary).not.toHaveBeenCalled()
  })

  it('returns the summary for an authorized administrator', async () => {
    authState.getSessionUser = vi.fn(async () => adminUser)

    const response = await request(app)
      .get('/api/analytics/summary?range=today')
      .set('Cookie', ['refreshToken=valid-admin-token'])
      .expect(200)

    expect(response.body).toEqual(summaryFixture)
    expect(response.headers['cache-control']).toBe('no-store')
    expect(analyticsState.getSummary).toHaveBeenCalledWith('today')
  })

  it('defaults to the last seven days', async () => {
    authState.getSessionUser = vi.fn(async () => adminUser)

    await request(app)
      .get('/api/analytics/summary')
      .set('Cookie', ['refreshToken=valid-admin-token'])
      .expect(200)

    expect(analyticsState.getSummary).toHaveBeenCalledWith('7d')
  })

  it('rejects unsupported ranges', async () => {
    authState.getSessionUser = vi.fn(async () => adminUser)

    const response = await request(app)
      .get('/api/analytics/summary?range=90d')
      .set('Cookie', ['refreshToken=valid-admin-token'])
      .expect(400)

    expect(response.body).toMatchObject({ error: { code: 'INVALID_RANGE' } })
    expect(analyticsState.getSummary).not.toHaveBeenCalled()
  })
})
