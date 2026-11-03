import { Router } from 'express'
import { createAuthController } from '../controllers/authController.js'
import { authenticateToken } from '../utils/authMiddleware.js'

export function createAuthRoutes() {
  const router = Router()
  const controller = createAuthController()

  router.post('/login', controller.login)
  router.post('/logout', controller.logout)
  router.get('/verify', authenticateToken, controller.verify)

  return router
}
