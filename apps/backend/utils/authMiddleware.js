import { verifyToken } from '../services/authService.js'
import { AppError } from '../utils/errors.js'

export function authenticateToken(req, res, next) {
  const token = req.cookies && req.cookies.auth_token

  if (!token) {
    throw new AppError('Authentication required', 401, 'INVALID_TOKEN')
  }

  try {
    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (error) {
    throw new AppError('Invalid or expired token', 401, 'INVALID_TOKEN')
  }
}
