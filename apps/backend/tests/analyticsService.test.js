import { beforeEach, describe, expect, it, vi } from 'vitest'

const modelState = vi.hoisted(() => ({
  create: async () => ({}),
  aggregate: async () => [],
}))

vi.mock('../models/AnalyticsEvents.js', () => ({
  __esModule: true,
  default: {
    create: (...args) => modelState.create(...args),
    aggregate: (...args) => modelState.aggregate(...args),
  },
}))

import AnalyticsService from '../services/AnalyticsService.js'

function createAggregateMock() {
  return vi.fn(async (pipeline) => {
    const match = pipeline[0].$match

    if (!match.type) {
      return [{ pageViews: 10, tourStarts: 4, floorVisits: 7 }]
    }

    if (match.type === 'page_view') {
      return [{ total: 6 }]
    }

    if (match.type === 'floor_view') {
      return [
        { _id: 'LG', visits: 5 },
        { _id: '5F', visits: 2 },
      ]
    }

    if (match.type === 'location_view') {
      return [{ _id: 'glitch-tower-lobby', visits: 3 }]
    }

    return []
  })
}

describe('AnalyticsService', () => {
  beforeEach(() => {
    modelState.create = vi.fn(async () => ({}))
    modelState.aggregate = createAggregateMock()
  })

  it('records a valid event once', async () => {
    const event = { eventId: 'tour_start:s_ab12cd34', type: 'tour_start' }
    const result = await AnalyticsService.recordEvent(event)

    expect(result).toEqual({ created: true })
    expect(modelState.create).toHaveBeenCalledWith(event)
  })

  it('treats a duplicate eventId as an idempotent success', async () => {
    modelState.create = vi.fn(async () => {
      const error = new Error('duplicate key')
      error.code = 11000
      throw error
    })

    const result = await AnalyticsService.recordEvent({ eventId: 'duplicate' })

    expect(result).toEqual({ created: false })
  })

  it('rethrows non-duplicate write failures', async () => {
    modelState.create = vi.fn(async () => {
      throw new Error('database offline')
    })

    await expect(AnalyticsService.recordEvent({ eventId: 'event-1' })).rejects.toThrow(
      'database offline',
    )
  })

  it('builds a summary from aggregation results', async () => {
    const summary = await AnalyticsService.getSummary(
      'today',
      new Date('2026-11-27T05:00:00.000Z'),
    )

    expect(summary).toEqual({
      range: 'today',
      timezone: 'Asia/Manila',
      start: '2026-11-26T16:00:00.000Z',
      end: '2026-11-27T16:00:00.000Z',
      totals: {
        pageViews: 10,
        uniqueVisitors: 6,
        tourStarts: 4,
        floorVisits: 7,
      },
      floors: [
        { floor: 'LG', visits: 5 },
        { floor: '5F', visits: 2 },
      ],
      locations: [{ locationId: 'glitch-tower-lobby', visits: 3 }],
      mostVisitedFloor: 'LG',
    })
  })

  it('filters every aggregation by the Manila window', async () => {
    await AnalyticsService.getSummary('today', new Date('2026-11-27T05:00:00.000Z'))

    for (const call of modelState.aggregate.mock.calls) {
      const match = call[0][0].$match
      expect(match.createdAt.$gte.toISOString()).toBe('2026-11-26T16:00:00.000Z')
      expect(match.createdAt.$lt.toISOString()).toBe('2026-11-27T16:00:00.000Z')
    }
  })

  it('returns zeroed totals when no events match', async () => {
    modelState.aggregate = vi.fn(async () => [])

    const summary = await AnalyticsService.getSummary('7d', new Date('2026-11-27T05:00:00.000Z'))

    expect(summary.totals).toEqual({
      pageViews: 0,
      uniqueVisitors: 0,
      tourStarts: 0,
      floorVisits: 0,
    })
    expect(summary.floors).toEqual([])
    expect(summary.locations).toEqual([])
    expect(summary.mostVisitedFloor).toBeNull()
  })

  it('rejects unsupported ranges without querying', async () => {
    const summary = await AnalyticsService.getSummary('90d')

    expect(summary).toBeNull()
    expect(modelState.aggregate).not.toHaveBeenCalled()
  })
})
