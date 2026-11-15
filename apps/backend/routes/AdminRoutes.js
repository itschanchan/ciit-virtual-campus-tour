import { Router } from 'express'
// import verifyToken from '../middleware/verifyToken.js'
// import { requireRole } from '../middleware/authorize.js'
import adminController from '../controllers/AdminController.js'

const router = Router()

/*
    AdminRoute.js - serves as the map for all Admin-related API endpoints.
    It defines the routes and associates them with the corresponding controller functions in AdminController.js.
    The middleman between the View and Controller.

    - GET /admins/:id - Get Admin details
    - POST /admins - Create a new Admin
    - PUT /admins/:id - Update Admin information
    - DELETE /admins/:id - Delete a Admin
    - PATCH /admins/:id/activate - Activate a Admin account
*/

router.get('/me', adminController.getMyProfile)
router.get('/:id', adminController.getAdminDetails)
router.post('/', adminController.createAdmin)
router.put('/:id', adminController.updateAdmin)
router.delete('/:id', adminController.deleteAdmin)
router.patch('/:id/activate', adminController.changePassword)

export default router
