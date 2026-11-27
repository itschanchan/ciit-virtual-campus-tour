import Admin from '../models/Admins.js'
import authService from '../services/AuthService.js'

const AUTH_ERROR_NAMES = new Set([
  'JsonWebTokenError',
  'TokenExpiredError',
  'NotBeforeError',
])

function isAuthenticationError(error) {
  if (!error) {
    return false
  }

  if (AUTH_ERROR_NAMES.has(error.name)) {
    return true
  }

  // AuthService.getSessionUser throws this plain Error when the token is
  // valid but the administrator no longer exists.
  return error.message === 'Admin not found.'
}

function sendUnauthorized(res, message) {
  return res.status(401).json({
    error: {
      code: 'UNAUTHORIZED',
      message,
    },
  })
}

function sendServerError(res) {
  return res.status(500).json({
    error: {
      code: 'ANALYTICS_AUTH_FAILED',
      message: 'The administrator session could not be verified.',
    },
  })
}

// Protects analytics retrieval with the same refresh-cookie session that
// GET /api/admin/session already uses. authService.getSessionUser verifies the
// token signature and expiry before loading the administrator.
const requireAdminSession = async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken

  if (!refreshToken) {
    return sendUnauthorized(res, 'Authentication required.')
  }

  let admin

  try {
    admin = await authService.getSessionUser(refreshToken)
  } catch (error) {
    if (isAuthenticationError(error)) {
      return sendUnauthorized(res, 'Invalid or expired session.')
    }

    return sendServerError(res)
  }

  if (!admin) {
    return sendUnauthorized(res, 'Invalid or expired session.')
  }

  try {
    const isActive = await Admin.exists({ _id: admin.id, is_active: true })

    if (!isActive) {
      return sendUnauthorized(res, 'Invalid or expired session.')
    }
  } catch {
    return sendServerError(res)
  }

  req.admin = admin
  return next()
}

export default requireAdminSession
