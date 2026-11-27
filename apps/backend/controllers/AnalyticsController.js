import analyticsService from '../services/AnalyticsService.js'
import { REPORT_RANGES, validateAnalyticsEvent } from '../utils/analytics.js'

const analyticsController = {
  // POST /api/analytics/events
  createEvent: async (req, res) => {
    const result = validateAnalyticsEvent(req.body)

    if (!result.valid) {
      return res.status(400).json({
        error: {
          code: 'INVALID_EVENT',
          message: result.errors.join(' '),
        },
      })
    }

    try {
      await analyticsService.recordEvent(result.event)
      return res.status(204).end()
    } catch {
      return res.status(500).json({
        error: {
          code: 'ANALYTICS_WRITE_FAILED',
          message: 'The analytics event could not be recorded.',
        },
      })
    }
  },

  // GET /api/analytics/summary?range=today|7d|30d
  getSummary: async (req, res) => {
    res.set('Cache-Control', 'no-store')

    const range = req.query.range ?? '7d'

    if (!REPORT_RANGES.includes(range)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_RANGE',
          message: `range must be one of ${REPORT_RANGES.join(', ')}.`,
        },
      })
    }

    try {
      const summary = await analyticsService.getSummary(range)
      return res.status(200).json(summary)
    } catch {
      return res.status(500).json({
        error: {
          code: 'ANALYTICS_READ_FAILED',
          message: 'The analytics summary could not be loaded.',
        },
      })
    }
  },
}

export default analyticsController
