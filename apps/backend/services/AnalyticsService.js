import AnalyticsEvent from '../models/AnalyticsEvents.js'
import { resolveAnalyticsRange } from '../utils/analytics.js'

const DUPLICATE_KEY_CODE = 11000

async function aggregateTotals(match) {
  const rows = await AnalyticsEvent.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        pageViews: { $sum: { $cond: [{ $eq: ['$type', 'page_view'] }, 1, 0] } },
        tourStarts: { $sum: { $cond: [{ $eq: ['$type', 'tour_start'] }, 1, 0] } },
        floorVisits: { $sum: { $cond: [{ $eq: ['$type', 'floor_view'] }, 1, 0] } },
      },
    },
  ])

  return rows[0] ?? { pageViews: 0, tourStarts: 0, floorVisits: 0 }
}

async function aggregateUniqueVisitors(match) {
  const rows = await AnalyticsEvent.aggregate([
    { $match: { ...match, type: 'page_view' } },
    { $group: { _id: '$sessionId' } },
    { $count: 'total' },
  ])

  return rows[0]?.total ?? 0
}

async function aggregateFloors(match) {
  const rows = await AnalyticsEvent.aggregate([
    { $match: { ...match, type: 'floor_view' } },
    { $group: { _id: '$floor', visits: { $sum: 1 } } },
    { $sort: { visits: -1, _id: 1 } },
  ])

  return rows.map((row) => ({ floor: row._id, visits: row.visits }))
}

async function aggregateLocations(match) {
  const rows = await AnalyticsEvent.aggregate([
    { $match: { ...match, type: 'location_view' } },
    { $group: { _id: '$locationId', visits: { $sum: 1 } } },
    { $sort: { visits: -1, _id: 1 } },
  ])

  return rows.map((row) => ({ locationId: row._id, visits: row.visits }))
}

const AnalyticsService = {
  recordEvent: async (event) => {
    try {
      await AnalyticsEvent.create(event)
      return { created: true }
    } catch (error) {
      // A repeated eventId is a retry or duplicate submission, not a failure.
      if (error.code === DUPLICATE_KEY_CODE) {
        return { created: false }
      }

      throw error
    }
  },

  getSummary: async (range, now = new Date()) => {
    const rangeWindow = resolveAnalyticsRange(range, now)

    if (!rangeWindow) {
      return null
    }

    const match = { createdAt: { $gte: rangeWindow.start, $lt: rangeWindow.end } }
    const [totals, uniqueVisitors, floors, locations] = await Promise.all([
      aggregateTotals(match),
      aggregateUniqueVisitors(match),
      aggregateFloors(match),
      aggregateLocations(match),
    ])

    return {
      range: rangeWindow.range,
      timezone: rangeWindow.timezone,
      start: rangeWindow.start.toISOString(),
      end: rangeWindow.end.toISOString(),
      totals: {
        pageViews: totals.pageViews,
        uniqueVisitors,
        tourStarts: totals.tourStarts,
        floorVisits: totals.floorVisits,
      },
      floors,
      locations,
      mostVisitedFloor: floors[0]?.floor ?? null,
    }
  },
}

export default AnalyticsService
