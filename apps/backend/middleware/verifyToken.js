import jwt from 'jsonwebtoken'

// This middleware protects routes that require a logged-in admin.
// It reads the JWT from the HTTP-only session cookie (set at login).
const verifyToken = (req, res, next) => {
  const token =
    req.cookies?.token ??
    (req.headers.authorization && req.headers.authorization.split(" ")[1]) ??
    null

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired session' })
  }
}

export default verifyToken
