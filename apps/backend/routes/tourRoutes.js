import { Router } from 'express'
import { createTourController } from '../controllers/tourController.js'

export function createTourRoutes() {
  const router = Router()
  const controller = createTourController()

  router.get('/', controller.getAllLocations)
  router.get('/:slug', controller.getLocationBySlug)

  return router
}
