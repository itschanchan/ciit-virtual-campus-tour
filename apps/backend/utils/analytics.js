// Shared analytics rules: event validation and Asia/Manila report windows.

export const EVENT_TYPES = ['page_view', 'tour_start', 'floor_view', 'location_view']
export const REPORT_RANGES = ['today', '7d', '30d']
export const REPORT_TIMEZONE = 'Asia/Manila'

const MANILA_OFFSET_MS = 8 * 60 * 60 * 1000

const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/
const EVENT_ID_PATTERN = /^[A-Za-z0-9:_-]{8,120}$/
const FLOOR_PATTERN = /^(LG|UG|\d{1,2}[FM])$/
const LOCATION_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const SCENE_ID_PATTERN = /^[A-Za-z0-9-]{1,40}$/

const ALLOWED_FIELDS = {
  page_view: ['eventId', 'type', 'sessionId', 'path'],
  tour_start: ['eventId', 'type', 'sessionId'],
  floor_view: ['eventId', 'type', 'sessionId', 'floor', 'locationId', 'sceneId'],
  location_view: ['eventId', 'type', 'sessionId', 'locationId', 'floor', 'sceneId'],
}

const RANGE_DAYS = {
  today: 1,
  '7d': 7,
  '30d': 30,
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function matches(value, pattern) {
  return typeof value === 'string' && pattern.test(value)
}

function findUnexpectedFields(payload, allowedFields) {
  return Object.keys(payload).filter((key) => !allowedFields.includes(key))
}

function validateIdentity(payload, errors) {
  if (!matches(payload.sessionId, SESSION_ID_PATTERN)) {
    errors.push('sessionId must be 8-64 characters using letters, numbers, underscores, or hyphens.')
  }

  if (!matches(payload.eventId, EVENT_ID_PATTERN)) {
    errors.push('eventId must be 8-120 characters using letters, numbers, colons, underscores, or hyphens.')
  }
}

function validateOptionalFields(payload, errors) {
  if (payload.floor !== undefined && !matches(payload.floor, FLOOR_PATTERN)) {
    errors.push('floor must be a floor label such as LG, UG, or 5F.')
  }

  if (payload.sceneId !== undefined && !matches(payload.sceneId, SCENE_ID_PATTERN)) {
    errors.push('sceneId must be 1-40 characters using letters, numbers, or hyphens.')
  }

  // floor_view may omit locationId when the floor cannot be resolved to a
  // catalog location, so null and undefined both mean "not provided".
  if (
    payload.locationId !== undefined &&
    payload.locationId !== null &&
    !matches(payload.locationId, LOCATION_ID_PATTERN)
  ) {
    errors.push('locationId must be lowercase kebab-case when provided.')
  }
}

function validatePageView(payload, errors) {
  const hasValidPath =
    typeof payload.path === 'string' &&
    payload.path.startsWith('/') &&
    payload.path.length <= 200

  if (!hasValidPath) {
    errors.push('path is required for page_view and must start with "/".')
  }
}

function validateFloorView(payload, errors) {
  if (!matches(payload.floor, FLOOR_PATTERN)) {
    errors.push('floor is required for floor_view and must be a floor label such as LG, UG, or 5F.')
  }
}

function validateLocationView(payload, errors) {
  if (!matches(payload.locationId, LOCATION_ID_PATTERN)) {
    errors.push('locationId is required for location_view and must be lowercase kebab-case.')
  }
}

function buildStoredEvent(payload, type) {
  return {
    eventId: payload.eventId,
    type,
    sessionId: payload.sessionId,
    path: type === 'page_view' ? payload.path : null,
    floor: payload.floor ?? null,
    locationId: payload.locationId ?? null,
    sceneId: payload.sceneId ?? null,
  }
}

export function validateAnalyticsEvent(payload) {
  if (!isPlainObject(payload)) {
    return { valid: false, errors: ['The event payload must be an object.'], event: null }
  }

  const type = payload.type
  if (!EVENT_TYPES.includes(type)) {
    return {
      valid: false,
      errors: [`type must be one of ${EVENT_TYPES.join(', ')}.`],
      event: null,
    }
  }

  const errors = []
  const unexpectedFields = findUnexpectedFields(payload, ALLOWED_FIELDS[type])

  if (unexpectedFields.length > 0) {
    errors.push(`Unexpected field(s): ${unexpectedFields.join(', ')}.`)
  }

  validateIdentity(payload, errors)
  validateOptionalFields(payload, errors)

  if (type === 'page_view') {
    validatePageView(payload, errors)
  }

  if (type === 'floor_view') {
    validateFloorView(payload, errors)
  }

  if (type === 'location_view') {
    validateLocationView(payload, errors)
  }

  if (errors.length > 0) {
    return { valid: false, errors, event: null }
  }

  return { valid: true, errors: [], event: buildStoredEvent(payload, type) }
}

function getManilaDateParts(now) {
  const manilaTime = new Date(now.getTime() + MANILA_OFFSET_MS)

  return {
    year: manilaTime.getUTCFullYear(),
    month: manilaTime.getUTCMonth(),
    day: manilaTime.getUTCDate(),
  }
}

function getManilaMidnightUtc(year, month, day) {
  return new Date(Date.UTC(year, month, day) - MANILA_OFFSET_MS)
}

export function resolveAnalyticsRange(range, now = new Date()) {
  if (!REPORT_RANGES.includes(range)) {
    return null
  }

  const { year, month, day } = getManilaDateParts(now)
  const days = RANGE_DAYS[range]
  const start = getManilaMidnightUtc(year, month, day - (days - 1))
  const end = getManilaMidnightUtc(year, month, day + 1)

  return {
    range,
    timezone: REPORT_TIMEZONE,
    start,
    end,
  }
}
