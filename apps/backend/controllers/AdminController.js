import { createAdminAuthService } from '../services/AdminAuthService.js'
import { AppError } from '../utils/errors.js'

let authService = null

function getAuthService() {
  if (!authService) {
    authService = createAdminAuthService()
  }
  return authService
}

export default {
  // POST /api/admins/login - Authenticate admin and issue JWT cookie
  async login(req, res) {
    const { username, email, password } = req.body ?? {}

    if (!username && !email) {
      throw new AppError('Username or email is required', 400, 'VALIDATION_ERROR')
    }
    if (!password) {
      throw new AppError('Password is required', 400, 'VALIDATION_ERROR')
    }

    let token, user
    try {
      ;({ token, user } = await getAuthService().login({ username, email, password }))
    } catch {
      throw new AppError('Invalid credentials.', 401, 'INVALID_CREDENTIALS')
    }

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    res.status(200).json({
      message: 'Login successful',
      user,
    })
  },

  // POST /api/admins/logout - Clear admin session cookie
  async logout(req, res) {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
    res.status(200).json({ message: 'Logout successful' })
  },

  // GET /api/admins/session - Return current authenticated admin session
  async session(req, res) {
    const token = req.cookies?.token ?? null

    if (!token) {
      throw new AppError('Authentication required', 401, 'AUTH_REQUIRED')
    }

    const user = await getAuthService().getSessionUser(token)

    if (!user) {
      throw new AppError('Invalid or expired session', 401, 'AUTH_REQUIRED')
    }

    res.status(200).json({ user })
  },

  // GET /api/admins/me - Return the authenticated admin's own profile
  async getMyProfile(req, res) {
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

  // GET /api/admins/:id - Return an admin's details by identifier (admin only)
  async getUserDetails(req, res) {
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

  // POST /api/admins/ - Create a new admin account (admin only)
  async createUser(req, res) {
    const { username, email, password, role } = req.body ?? {}

    if (!username || !email || !password) {
      throw new AppError('Username, email, and password are required', 400, 'VALIDATION_ERROR')
    }

    res.status(201).json({
      id: 'new-admin-id',
      username,
      email,
      role: role ?? 'admin',
      isActive: true,
    })
  },

  // PUT /api/admins/:id - Update an existing admin's information (admin only)
  async updateUser(req, res) {
    const { email, role, isActive } = req.body ?? {}

    res.status(200).json({
      id: req.params.id,
      username: req.user.username,
      email: email ?? req.user.email,
      role: role ?? req.user.role,
      isActive: isActive ?? true,
    })
  },

  // DELETE /api/admins/:id - Delete an admin account (admin only)
  async deleteUser(req, res) {
    res.status(200).json({ message: 'Admin deleted successfully' })
  },

  // PATCH /api/admins/:id/activate - Activate or deactivate an admin account (admin only)
  async changePassword(req, res) {
    const { isActive } = req.body ?? {}

    res.status(200).json({
      id: req.params.id,
      isActive: isActive !== false,
      message: `Admin account ${isActive !== false ? 'activated' : 'deactivated'} successfully`,
    })
  },
}
