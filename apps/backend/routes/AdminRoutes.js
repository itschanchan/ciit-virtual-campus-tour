import { Router } from 'express'
import verifyToken from '../middleware/verifyToken.js'
import { requireRole } from '../middleware/authorize.js'
import adminController from '../controllers/AdminController.js'

const router = Router()

// Public auth endpoints
router.post('/login', adminController.login)
router.post('/logout', adminController.logout)

// Protected admin endpoints (require valid session)
router.get('/session', adminController.session)
router.get('/me', verifyToken, adminController.getMyProfile)

// Admin-only user management (require admin role)
router.get('/:id', requireRole('admin'), adminController.getUserDetails)
router.post('/', requireRole('admin'), adminController.createUser)
router.put('/:id', requireRole('admin'), adminController.updateUser)
router.delete('/:id', requireRole('admin'), adminController.deleteUser)
router.patch('/:id/activate', requireRole('admin'), adminController.changePassword)

export default router
