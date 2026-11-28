import jwt from 'jsonwebtoken'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const adminState = vi.hoisted(() => ({
  admin: null,
}))

vi.mock('../models/Admins.js', () => ({
  __esModule: true,
  default: {
    findById: async () => adminState.admin,
  },
}))

import authService from '../services/AuthService.js'

const refreshSecret = process.env.REFRESH_TOKEN_SECRET

function signRefreshToken(payload, options) {
  return jwt.sign(payload, refreshSecret, options)
}

describe('authService.getSessionUser', () => {
  beforeEach(() => {
    adminState.admin = {
      _id: 'admin-1',
      username: 'admin',
      email: 'admin@ciit.edu.ph',
      role: 'admin',
    }
  })

  it('returns the administrator for a valid refresh token', async () => {
    const token = signRefreshToken({ adminId: 'admin-1' }, { expiresIn: '1h' })
    const user = await authService.getSessionUser(token)

    expect(user).toMatchObject({ id: 'admin-1', username: 'admin' })
  })

  it('rejects a token signed with a different secret', async () => {
    const token = jwt.sign({ adminId: 'admin-1' }, 'not-the-refresh-secret')

    await expect(authService.getSessionUser(token)).rejects.toThrow()
  })

  it('rejects an expired refresh token', async () => {
    const token = signRefreshToken({ adminId: 'admin-1' }, { expiresIn: '-1s' })

    await expect(authService.getSessionUser(token)).rejects.toThrow()
  })

  it('rejects a token for a missing administrator', async () => {
    adminState.admin = null
    const token = signRefreshToken({ adminId: 'missing' }, { expiresIn: '1h' })

    await expect(authService.getSessionUser(token)).rejects.toThrow()
  })
})
