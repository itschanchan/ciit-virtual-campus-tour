import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  SESSION_STORAGE_KEY,
  getSessionId,
  trackFloorView,
  trackLocationView,
  trackPageView,
  trackTourStart,
} from '../lib/analytics'

const SESSION_PATTERN = /^[A-Za-z0-9_-]{8,64}$/
const EVENT_ID_PATTERN = /^[A-Za-z0-9:_-]{8,120}$/

function getBody(call) {
  return JSON.parse(call[1].body)
}

function getLastBody(fetchMock) {
  return getBody(fetchMock.mock.calls[fetchMock.mock.calls.length - 1])
}

describe('analytics', () => {
  let fetchMock

  beforeEach(() => {
    window.sessionStorage.clear()
    fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 204 })
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    window.sessionStorage.clear()
  })

  describe('getSessionId', () => {
    it('reuses one anonymous session id per tab session', () => {
      const first = getSessionId()
      const second = getSessionId()

      expect(second).toBe(first)
      expect(first).toMatch(SESSION_PATTERN)
      expect(window.sessionStorage.getItem(SESSION_STORAGE_KEY)).toBe(first)
    })

    it('creates a new id after the tab session storage is cleared', () => {
      const first = getSessionId()

      window.sessionStorage.clear()
      const second = getSessionId()

      expect(second).not.toBe(first)
      expect(second).toMatch(SESSION_PATTERN)
    })

    it('replaces a stored id that violates the backend contract', () => {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, 'short')

      const sessionId = getSessionId()

      expect(sessionId).not.toBe('short')
      expect(sessionId).toMatch(SESSION_PATTERN)
      expect(window.sessionStorage.getItem(SESSION_STORAGE_KEY)).toBe(sessionId)
    })

    it('prefers crypto.randomUUID when it is available', async () => {
      vi.resetModules()
      window.sessionStorage.clear()
      vi.stubGlobal('crypto', {
        randomUUID: () => '11111111-2222-3333-4444-555555555555',
        getRandomValues: () => {
          throw new Error('getRandomValues should not be used')
        },
      })

      const module = await import('../lib/analytics')
      const sessionId = module.getSessionId()

      expect(sessionId).toBe('11111111222233334444555555555555')
      expect(sessionId).toMatch(SESSION_PATTERN)
    })

    it('falls back to crypto.getRandomValues without randomUUID', async () => {
      vi.resetModules()
      window.sessionStorage.clear()
      vi.stubGlobal('crypto', {
        getRandomValues(array) {
          array.fill(7)
          return array
        },
      })

      const module = await import('../lib/analytics')
      const sessionId = module.getSessionId()

      expect(sessionId).toBe('07070707070707070707070707070707')
      expect(sessionId).toMatch(SESSION_PATTERN)
    })

    it('uses an in-memory identifier when storage and secure randomness are unavailable', async () => {
      vi.resetModules()
      window.sessionStorage.clear()
      vi.spyOn(window.Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('storage blocked')
      })
      vi.spyOn(window.Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('storage blocked')
      })
      vi.stubGlobal('crypto', {})

      const module = await import('../lib/analytics')
      const first = module.getSessionId()
      const second = module.getSessionId()

      expect(first).toMatch(/^memory-[a-z0-9-]+$/)
      expect(first).toMatch(SESSION_PATTERN)
      expect(second).toBe(first)
    })
  })

  describe('event ids', () => {
    it('generates unique event ids with the backend charset', () => {
      for (let index = 0; index < 50; index += 1) {
        trackTourStart()
      }

      const ids = fetchMock.mock.calls.map((call) => getBody(call).eventId)

      expect(new Set(ids).size).toBe(ids.length)
      ids.forEach((id) => expect(id).toMatch(EVENT_ID_PATTERN))
    })
  })

  describe('payloads', () => {
    it('sends a page view with only page_view fields', () => {
      trackPageView('/')

      const [url, options] = fetchMock.mock.calls[0]
      const body = getBody(fetchMock.mock.calls[0])

      expect(url).toBe('/api/analytics/events')
      expect(options.method).toBe('POST')
      expect(options.credentials).toBe('include')
      expect(options.headers['Content-Type']).toBe('application/json')
      expect(options.keepalive).toBe(true)
      expect(Object.keys(body).sort()).toEqual([
        'eventId',
        'path',
        'sessionId',
        'type',
      ])
      expect(body.type).toBe('page_view')
      expect(body.path).toBe('/')
      expect(body.sessionId).toMatch(SESSION_PATTERN)
      expect(body.eventId).toMatch(EVENT_ID_PATTERN)
    })

    it('sends a tour start without unrelated fields', () => {
      trackTourStart()

      const body = getLastBody(fetchMock)

      expect(Object.keys(body).sort()).toEqual([
        'eventId',
        'sessionId',
        'type',
      ])
      expect(body.type).toBe('tour_start')
    })

    it('sends a floor view with its resolved location and scene', () => {
      trackFloorView({
        floor: 'LG',
        locationId: 'glitch-tower-lobby',
        sceneId: '0-lg---1',
      })

      const body = getLastBody(fetchMock)

      expect(Object.keys(body).sort()).toEqual([
        'eventId',
        'floor',
        'locationId',
        'sceneId',
        'sessionId',
        'type',
      ])
      expect(body).toMatchObject({
        type: 'floor_view',
        floor: 'LG',
        locationId: 'glitch-tower-lobby',
        sceneId: '0-lg---1',
      })
    })

    it('omits locationId when a floor has no catalog location', () => {
      trackFloorView({ floor: '1F' })

      const body = getLastBody(fetchMock)

      expect(body.type).toBe('floor_view')
      expect(body.floor).toBe('1F')
      expect('locationId' in body).toBe(false)
      expect('sceneId' in body).toBe(false)
    })

    it('sends a location view with floor and scene', () => {
      trackLocationView({
        locationId: 'ug-ground',
        floor: 'UG',
        sceneId: '6-ug---2',
      })

      const body = getLastBody(fetchMock)

      expect(body).toMatchObject({
        type: 'location_view',
        locationId: 'ug-ground',
        floor: 'UG',
        sceneId: '6-ug---2',
      })
    })
  })

  describe('failure handling', () => {
    it('swallows network failures', async () => {
      fetchMock.mockRejectedValueOnce(new TypeError('Failed to parse URL'))

      await expect(trackPageView('/')).resolves.toBeUndefined()
    })

    it('ignores non-ok responses without reading the body', async () => {
      const response = { ok: false, status: 500 }
      fetchMock.mockResolvedValueOnce(response)

      await expect(trackTourStart()).resolves.toBeUndefined()
      expect(response.json).toBeUndefined()
    })
  })
})
