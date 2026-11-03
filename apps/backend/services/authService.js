import jwt from 'jsonwebtoken'

export function signToken(userId, email) {
  const JWT_SECRET = process.env.JWT_SECRET
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'
  return jwt.sign({ sub: userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token) {
  const JWT_SECRET = process.env.JWT_SECRET
  return jwt.verify(token, JWT_SECRET)
}

export function setAuthCookie(res, token) {
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000,
  })
}

export function clearAuthCookie(res) {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  })
}
