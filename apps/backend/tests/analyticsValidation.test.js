import { describe, expect, it } from 'vitest'
import { validateAnalyticsEvent } from '../utils/analytics.js'

const baseEvent = {
  eventId: 'page_view:s_ab12cd34:ld_9f8e',
  type: 'page_view',
  sessionId: 's_ab12cd34',
  path: '/',
}

const floorEvent = {
  eventId: 'floor_view:s_ab12cd34:ld_9f8e:1',
  type: 'floor_view',
  sessionId: 's_ab12cd34',
  floor: 'LG',
  sceneId: '0-lg---1',
}

const locationEvent = {
  eventId: 'location_view:s_ab12cd34:ld_9f8e:2',
  type: 'location_view',
  sessionId: 's_ab12cd34',
  locationId: 'glitch-tower-lobby',
  floor: 'LG',
  sceneId: '0-lg---1',
}

const tourStartEvent = {
  eventId: 'tour_start:s_ab12cd34',
  type: 'tour_start',
  sessionId: 's_ab12cd34',
}

function messageFor(payload) {
  const result = validateAnalyticsEvent(payload)
  return result.errors.join(' ')
}

describe('validateAnalyticsEvent', () => {
  it('accepts a page_view and keeps only stored fields', () => {
    const result = validateAnalyticsEvent(baseEvent)

    expect(result.valid).toBe(true)
    expect(result.event).toEqual({
      eventId: baseEvent.eventId,
      type: 'page_view',
      sessionId: 's_ab12cd34',
      path: '/',
      floor: null,
      locationId: null,
      sceneId: null,
    })
  })

  it('accepts a tour_start without target fields', () => {
    const result = validateAnalyticsEvent(tourStartEvent)

    expect(result.valid).toBe(true)
    expect(result.event).toMatchObject({ type: 'tour_start', floor: null, locationId: null })
  })

  it('accepts a floor_view with a scene', () => {
    const result = validateAnalyticsEvent(floorEvent)

    expect(result.valid).toBe(true)
    expect(result.event).toMatchObject({ type: 'floor_view', floor: 'LG', locationId: null })
  })

  it('accepts a floor_view with a resolved location', () => {
    const result = validateAnalyticsEvent({ ...floorEvent, locationId: 'glitch-tower-lobby' })

    expect(result.valid).toBe(true)
    expect(result.event).toMatchObject({
      type: 'floor_view',
      floor: 'LG',
      locationId: 'glitch-tower-lobby',
      sceneId: '0-lg---1',
    })
  })

  it('treats a null floor_view location as not provided', () => {
    const result = validateAnalyticsEvent({ ...floorEvent, locationId: null })

    expect(result.valid).toBe(true)
    expect(result.event.locationId).toBeNull()
  })

  it('rejects an invalid floor_view location', () => {
    expect(messageFor({ ...floorEvent, locationId: 'Glitch Tower' })).toContain(
      'locationId must be lowercase kebab-case',
    )
  })

  it('accepts a location_view with floor and scene', () => {
    const result = validateAnalyticsEvent(locationEvent)

    expect(result.valid).toBe(true)
    expect(result.event).toMatchObject({
      type: 'location_view',
      locationId: 'glitch-tower-lobby',
      floor: 'LG',
      sceneId: '0-lg---1',
    })
  })

  it('rejects a non-object payload', () => {
    expect(validateAnalyticsEvent(null).valid).toBe(false)
    expect(validateAnalyticsEvent([]).valid).toBe(false)
    expect(validateAnalyticsEvent('page_view').valid).toBe(false)
  })

  it('rejects an unknown event type', () => {
    expect(messageFor({ ...baseEvent, type: 'session_end' })).toContain('type must be one of')
  })

  it('rejects malformed session identifiers', () => {
    expect(messageFor({ ...baseEvent, sessionId: 'short' })).toContain('sessionId must be')
    expect(messageFor({ ...baseEvent, sessionId: 'bad session!' })).toContain('sessionId must be')
  })

  it('rejects malformed event identifiers', () => {
    expect(messageFor({ ...baseEvent, eventId: 'x' })).toContain('eventId must be')
  })

  it('requires a path for page_view', () => {
    expect(messageFor({ ...baseEvent, path: undefined })).toContain('path is required')
    expect(messageFor({ ...baseEvent, path: 'tour' })).toContain('path is required')
    expect(messageFor({ ...baseEvent, path: `/${'a'.repeat(201)}` })).toContain('path is required')
  })

  it('requires a valid floor for floor_view', () => {
    expect(messageFor({ ...floorEvent, floor: undefined })).toContain('floor is required')
    expect(messageFor({ ...floorEvent, floor: 'basement' })).toContain('floor is required')
  })

  it('requires a valid location for location_view', () => {
    expect(messageFor({ ...locationEvent, locationId: undefined })).toContain('locationId is required')
    expect(messageFor({ ...locationEvent, locationId: 'Glitch Tower' })).toContain('locationId is required')
  })

  it('rejects unexpected fields instead of storing them', () => {
    expect(messageFor({ ...baseEvent, floor: 'LG' })).toContain('Unexpected field(s): floor')
    expect(messageFor({ ...tourStartEvent, path: '/' })).toContain('Unexpected field(s): path')
  })

  it('rejects an invalid optional sceneId', () => {
    expect(messageFor({ ...floorEvent, sceneId: 'bad scene!' })).toContain('sceneId must be')
  })
})
