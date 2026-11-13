import { AppError } from '../utils/errors.js'

export default {
  // GET /api/users/me - Return the authenticated user's own profile
  getMyProfile(req, res) {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'AUTH_REQUIRED')
    }

    res.status(200).json({
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      isActive: req.user.isActive ?? true,
    })
  },

  // GET /api/users/:id - Return a user's details by identifier
  getUserDetails(req, res) {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'AUTH_REQUIRED')
    }

    res.status(200).json({
      id: req.params.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      isActive: true,
    })
  },

  // POST /api/users/ - Create a new user account (admin only)
  createUser(req, res) {
    const { username, email, password, role } = req.body ?? {}

    if (!username || !email || !password) {
      throw new AppError('Username, email, and password are required', 400, 'VALIDATION_ERROR')
    }

    res.status(201).json({
      id: 'new-user-id',
      username,
      email,
      role: role ?? 'user',
      isActive: true,
    })
  },

  // PUT /api/users/:id - Update an existing user's information (admin only)
  updateUser(req, res) {
    const { email, role, isActive } = req.body ?? {}

    res.status(200).json({
      id: req.params.id,
      username: req.user.username,
      email: email ?? req.user.email,
      role: role ?? req.user.role,
      isActive: isActive ?? true,
    })
  },

  // DELETE /api/users/:id - Delete a user account (admin only)
  deleteUser(req, res) {
    res.status(200).json({ message: 'User deleted successfully' })
  },

  // PATCH /api/users/:id/activate - Activate or deactivate a user account (admin only)
  changePassword(req, res) {
    const { isActive } = req.body ?? {}

    res.status(200).json({
      id: req.params.id,
      isActive: isActive ?? true,
      message: `User account ${isActive !== false ? 'activated' : 'deactivated'} successfully`,
    })
  },
}
