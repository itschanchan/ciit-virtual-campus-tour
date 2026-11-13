import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AppError } from '../utils/errors.js'
import { Admin } from '../models/Admins.js'

export function sanitizeAdmin(admin) {
  if (!admin) {
    return null
  }

  const plainAdmin = admin.toObject ? admin.toObject() : admin
  const { password, ...safeAdmin } = plainAdmin

  return {
    ...safeAdmin,
    id: safeAdmin._id ? String(safeAdmin._id) : safeAdmin.id,
  }
}

export function createAdminAuthService({
  AdminModel = Admin,
  jwtSecret = process.env.JWT_SECRET,
  tokenTTL = '8h',
} = {}) {
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is required.')
  }

  async function login({ username, email, password }) {
    const identifier = username ?? email

    if (!identifier || !password) {
      throw new AppError('Invalid credentials.', 401, 'INVALID_CREDENTIALS')
    }

    let admin = null

    try {
      admin = await AdminModel.findOne({
        $or: [{ username: identifier }, { email: identifier }],
      })
    } catch {
      admin = null
    }

    if (!admin || !admin.password) {
      throw new AppError('Invalid credentials.', 401, 'INVALID_CREDENTIALS')
    }

    const passwordMatches = await bcrypt.compare(password, admin.password)

    if (!passwordMatches || !admin.is_active) {
      throw new AppError('Invalid credentials.', 401, 'INVALID_CREDENTIALS')
    }

    const user = sanitizeAdmin(admin)
    const token = jwt.sign(
      {
        sub: user.id,
        role: user.role,
        username: user.username,
      },
      jwtSecret,
      { expiresIn: tokenTTL },
    )

    return { token, user }
  }

  async function getSessionUser(token) {
    if (!token) {
      return null
    }

    try {
      const payload = jwt.verify(token, jwtSecret)
      const admin = await AdminModel.findById(payload.sub)

      if (!admin || !admin.is_active) {
        return null
      }

      return sanitizeAdmin(admin)
    } catch {
      return null
    }
  }

  async function logout() {
    return { ok: true }
  }

  return { login, logout, getSessionUser }
}
