import authService from '../services/AuthService.js'

// Drops public tracking events sent by a browser that holds a verified
// administrator session. Missing or invalid cookies are ignored so ordinary
// visitors are still tracked.
const suppressAdminEvents = async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken

  if (!refreshToken) {
    return next()
  }

  try {
    const admin = await authService.getSessionUser(refreshToken)

    if (admin) {
      return res.status(204).end()
    }

    return next()
  } catch {
    return next()
  }
}

export default suppressAdminEvents
