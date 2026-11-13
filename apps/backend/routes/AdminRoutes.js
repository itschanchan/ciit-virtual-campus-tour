import { Router } from 'express'
import verifyToken from '../middleware/verifyToken.js'
import { requireRole } from '../middleware/authorize.js'
import userController from '../controllers/UserController.js'
import gamesController from '../controllers/GamesController.js'

const router = Router()

/*
    NOTES:

    userRoute.js - serves as the map for all user-related API endpoints.
    It defines the routes and associates them with the corresponding controller functions in UserController.js.
    The middleman between the View and Controller.

    - GET /users/:id - Get user details
    - POST /users - Create a new user
    - PUT /users/:id - Update user information
    - DELETE /users/:id - Delete a user
    - PATCH /users/:id/activate - Activate a user account
*/

router.get('/me', verifyToken, userController.getMyProfile)
router.get('/me/rating-count', verifyToken, requireRole('author', 'admin'), gamesController.getMyRatingCount)
router.get('/:id', verifyToken, requireRole('admin'), userController.getUserDetails)
router.post('/', verifyToken, requireRole('admin'), userController.createUser)
router.put('/:id', verifyToken, requireRole('admin'), userController.updateUser)
router.delete('/:id', verifyToken, requireRole('admin'), userController.deleteUser)
router.patch('/:id/activate', verifyToken, requireRole('admin'), userController.changePassword)

export default router
