import { Router } from 'express'
// import verifyToken from '../middleware/verifyToken.js'
// import { requireRole } from '../middleware/authorize.js'
import AdminController from '../controllers/AdminController.js'

const router = Router()

// Public auth endpoints
router.post('/login', adminController.login)
router.post('/logout', adminController.logout)

    AdminRoute.js - serves as the map for all Admin-related API endpoints.
    It defines the routes and associates them with the corresponding controller functions in AdminController.js.
    The middleman between the View and Controller.

    - GET /admins/:id - Get Admin details
    - POST /admins - Create a new Admin
    - PUT /admins/:id - Update Admin information
    - DELETE /admins/:id - Delete a Admin
    - PATCH /admins/:id/activate - Activate a Admin account
*/

router.get('/me', AdminController.getMyProfile)
router.get('/:id', AdminController.getAdminDetails)
router.post('/', AdminController.createAdmin)
router.put('/:id', AdminController.updateAdmin)
router.delete('/:id', AdminController.deleteAdmin)
router.patch('/:id/activate', AdminController.changePassword)

export default router
