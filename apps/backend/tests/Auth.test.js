import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const adminUser = {
  id: 'admin-1',
  username: 'admin',
  email: 'admin@ciit.edu.ph',
  fullName: 'CIIT Admin',
  role: 'admin',
}

const authState = vi.hoisted(() => ({
  login: async () => {
    throw new Error('Invalid credentials')
  },
  logout: async () => ({ ok: true }),
  getSessionUser: async () => null,
}))

vi.mock('../services/AdminAuthService.js', () => ({
  createAdminAuthService: () => ({
    login: (...args) => authState.login(...args),
    logout: (...args) => authState.logout(...args),
    getSessionUser: (...args) => authState.getSessionUser(...args),
  }),
}))

import app from '../index.js'

describe('Admin auth routes', () => {
  beforeEach(() => {
    authState.login = async () => {
      throw new Error('Invalid credentials')
    }
    authState.logout = async () => ({ ok: true })
    authState.getSessionUser = async () => null
  })

  it('logs in an administrator and sets a secure cookie', async () => {
    authState.login = async ({ username, password }) => {
      if (username !== 'admin' || password !== 'secret123') {
        throw new Error('Invalid credentials')
      }

      return { token: 'mock-jwt', user: adminUser }
    }

    const response = await request(app)
      .post('/api/admins/login')
      .send({ username: 'admin', password: 'secret123' })
      .expect(200)

    expect(response.body.user).toMatchObject({ username: 'admin', role: 'admin' })
    expect(response.headers['set-cookie'][0]).toContain('token=')
    expect(response.headers['set-cookie'][0]).toContain('HttpOnly')
    expect(response.headers['set-cookie'][0]).not.toContain('Max-Age=')
  })

  it('rejects invalid login attempts', async () => {
    const response = await request(app)
      .post('/api/admins/login')
      .send({ username: 'admin', password: 'wrong' })
      .expect(401)

    expect(response.body).toMatchObject({ error: { code: 'INVALID_CREDENTIALS' } })
  })

  it('returns the current session user when a valid cookie is present', async () => {
    authState.getSessionUser = async () => adminUser

    const response = await request(app)
      .get('/api/admins/session')
      .set('Cookie', ['token=mock-jwt'])
      .expect(200)

    expect(response.body).toMatchObject({ user: { username: 'admin', role: 'admin' } })
  })
})
