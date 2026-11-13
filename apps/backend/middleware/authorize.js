import { AppError } from '../utils/errors.js'

// Role-based authorization middleware factory.
// Usage: requireRole('admin') or requireRole('author', 'admin')
// It checks req.user.role (set by verifyToken) against the allowed roles.
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient role' })
    }

    next()
  }
}
