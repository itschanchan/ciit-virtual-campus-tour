import { asyncHandler } from '../utils/asyncHandler.js'
import { AppError } from '../utils/errors.js'
import { signToken, setAuthCookie } from '../services/authService.js'

const loginAttempts = new Map()

export function createAuthController() {
  return {
    login: asyncHandler(async (req, res) => {
      const ip = req.ip || req.connection?.remoteAddress || 'unknown'
      const now = Date.now()
      const windowMs = 15 * 60 * 1000
      const maxAttempts = 5

      const record = loginAttempts.get(ip) || { count: 0, firstAttempt: now }

      if (now - record.firstAttempt > windowMs) {
        record.count = 0
        record.firstAttempt = now
      }

      if (record.count >= maxAttempts) {
        throw new AppError('Too many login attempts. Please try again later.', 429, 'RATE_LIMITED')
      }

      const { email, password } = req.body

      if (!email || !password) {
        record.count += 1
        loginAttempts.set(ip, record)
        throw new AppError('Email and password are required.', 400, 'MISSING_CREDENTIALS')
      }

      if (email !== 'user@example.com' || password !== 'password123') {
        record.count += 1
        loginAttempts.set(ip, record)
        throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS')
      }

      // Successful login: reset attempt counter for this IP
      loginAttempts.delete(ip)

      const userId = 'mock-user-id'
      const token = signToken(userId, email)
      setAuthCookie(res, token)

      res.status(200).json({
        message: 'Login successful',
        user: {
          id: userId,
          email,
        },
      })
    }),

    logout: asyncHandler(async (req, res) => {
      res.clearCookie('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      })

      res.status(200).json({ message: 'Logout successful' })
    }),

    verify: asyncHandler(async (req, res) => {
      res.status(200).json({
        authenticated: true,
        user: {
          id: req.user?.sub,
          email: req.user?.email,
        },
      })
    }),
  }
}
