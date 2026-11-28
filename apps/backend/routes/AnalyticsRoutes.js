import { Router } from 'express'
import analyticsController from '../controllers/AnalyticsController.js'
import rateLimitAnalyticsEvents from '../middleware/rateLimitAnalyticsEvents.js'
import requireAdminSession from '../middleware/requireAdminSession.js'
import suppressAdminEvents from '../middleware/suppressAdminEvents.js'

const router = Router()

// Public visitor tracking. Rate limiting runs before session lookup so a burst
// of requests cannot trigger an administrator query for every event. Events
// from a verified administrator session are acknowledged but not stored.
router.post(
  '/events',
  rateLimitAnalyticsEvents,
  suppressAdminEvents,
  analyticsController.createEvent,
)

// Admin-only reporting.
router.get('/summary', requireAdminSession, analyticsController.getSummary)

export default router
