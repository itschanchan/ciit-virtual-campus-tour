export function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  }
}

export function readSessionToken(req) {
  if (!req || !req.cookies) {
    return null
  }

  return req.cookies.token ?? null
}

export function attachSessionCookie(res, token) {
  res.cookie('token', token, getCookieOptions())
}

export function clearSessionCookie(res) {
  res.clearCookie('token', getCookieOptions())
}
