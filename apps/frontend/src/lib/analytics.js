// Best-effort analytics tracking for the public tour.
// The backend contract lives in apps/backend/utils/analytics.js.

const ENDPOINT = '/api/analytics/events'

export const SESSION_STORAGE_KEY = 'ciit_analytics_session'

const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/

let memorySessionId = null
let memorySessionCounter = 0
let eventCounter = 0

function toHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

// Prefer randomUUID, then getRandomValues. Return null when secure randomness
// is unavailable so the caller can fall back to an in-memory identifier.
function createSecureSessionId() {
  const cryptoApi = globalThis.crypto

  if (cryptoApi && typeof cryptoApi.randomUUID === 'function') {
    return cryptoApi.randomUUID().replace(/-/g, '')
  }

  if (cryptoApi && typeof cryptoApi.getRandomValues === 'function') {
    return toHex(cryptoApi.getRandomValues(new Uint8Array(16)))
  }

  return null
}

function createMemorySessionId() {
  memorySessionCounter += 1
  return `memory-${Date.now().toString(36)}-${memorySessionCounter}`
}

function readStoredSessionId() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.sessionStorage.getItem(SESSION_STORAGE_KEY)
  } catch {
    // Storage is optional; the caller falls back to memory.
    return null
  }
}

function storeSessionId(sessionId) {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId)
    return true
  } catch {
    // Storage is optional; the caller falls back to memory.
    return false
  }
}

export function getSessionId() {
  if (memorySessionId) {
    return memorySessionId
  }

  const stored = readStoredSessionId()
  if (stored && SESSION_ID_PATTERN.test(stored)) {
    return stored
  }

  const secureId = createSecureSessionId()

  if (!secureId) {
    memorySessionId = createMemorySessionId()
    return memorySessionId
  }

  if (!storeSessionId(secureId)) {
    memorySessionId = secureId
  }

  return secureId
}

function createRandomSuffix() {
  const cryptoApi = globalThis.crypto

  if (cryptoApi && typeof cryptoApi.getRandomValues === 'function') {
    return toHex(cryptoApi.getRandomValues(new Uint8Array(4)))
  }

  return Math.random().toString(36).slice(2, 10)
}

// Uniqueness comes from the timestamp and the module counter; the random
// suffix keeps separate tabs from colliding in the same millisecond.
function createEventId(prefix) {
  eventCounter += 1
  return `${prefix}:${Date.now().toString(36)}:${eventCounter}:${createRandomSuffix()}`
}

async function sendEvent(payload) {
  try {
    await fetch(ENDPOINT, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })
  } catch {
    // Analytics is best-effort and must never interrupt the tour.
  }
}

export function trackPageView(path) {
  return sendEvent({
    eventId: createEventId('page'),
    type: 'page_view',
    sessionId: getSessionId(),
    path,
  })
}

export function trackTourStart() {
  return sendEvent({
    eventId: createEventId('tour'),
    type: 'tour_start',
    sessionId: getSessionId(),
  })
}

export function trackFloorView({ floor, locationId, sceneId }) {
  const payload = {
    eventId: createEventId('floor'),
    type: 'floor_view',
    sessionId: getSessionId(),
    floor,
  }

  if (locationId) {
    payload.locationId = locationId
  }

  if (sceneId) {
    payload.sceneId = sceneId
  }

  return sendEvent(payload)
}

export function trackLocationView({ locationId, floor, sceneId }) {
  const payload = {
    eventId: createEventId('loc'),
    type: 'location_view',
    sessionId: getSessionId(),
    locationId,
  }

  if (floor) {
    payload.floor = floor
  }

  if (sceneId) {
    payload.sceneId = sceneId
  }

  return sendEvent(payload)
}
