import { Router } from 'express'
import { createHealthController } from '../controllers/healthController.js'

export function createHealthRoutes(healthService) {
  const router = Router()
  const controller = createHealthController(healthService)

  router.get('/', controller.getHealth)

  return router
}
