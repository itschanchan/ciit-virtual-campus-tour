import { Router } from 'express'
import { createAdminAuthController } from '../controllers/adminAuthController.js'

export function createAdminAuthRoutes(adminAuthService) {
  const router = Router()
  const controller = createAdminAuthController(adminAuthService)

  router.post('/login', controller.login)
  router.post('/logout', controller.logout)
  router.get('/session', controller.getSession)

  return router
}
