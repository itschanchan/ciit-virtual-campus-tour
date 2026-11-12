import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../app.js'

const adminUser = {
  id: 'admin-1',
  username: 'admin',
  email: 'admin@ciit.edu.ph',
  fullName: 'CIIT Admin',
  role: 'admin',
}

describe('Admin auth routes', () => {
  it('logs in an administrator and sets a secure cookie', async () => {
    const app = createApp({
      corsOrigins: ['http://localhost:5173'],
      adminAuthService: {
        login: async ({ username, password }) => {
          if (username !== 'admin' || password !== 'secret123') {
            throw new Error('Invalid credentials')
          }

          return { user: adminUser }
        },
        logout: async () => ({ ok: true }),
        getSessionUser: async () => adminUser,
      },
    })

    const response = await request(app)
      .post('/api/admin/login')
      .send({ username: 'admin', password: 'secret123' })
      .expect(200)

    expect(response.body.user).toMatchObject({ username: 'admin', role: 'admin' })
    expect(response.headers['set-cookie'][0]).toContain('token=')
    expect(response.headers['set-cookie'][0]).toContain('HttpOnly')
    expect(response.headers['set-cookie'][0]).not.toContain('Max-Age=')
  })

  it('rejects invalid login attempts', async () => {
    const app = createApp({
      corsOrigins: ['http://localhost:5173'],
      adminAuthService: {
        login: async () => {
          throw new Error('Invalid credentials')
        },
        logout: async () => ({ ok: true }),
        getSessionUser: async () => null,
      },
    })

    const response = await request(app)
      .post('/api/admin/login')
      .send({ username: 'admin', password: 'wrong' })
      .expect(401)

    expect(response.body).toMatchObject({ error: { code: 'INVALID_CREDENTIALS' } })
  })

  it('returns the current session user when a valid cookie is present', async () => {
    const app = createApp({
      corsOrigins: ['http://localhost:5173'],
      adminAuthService: {
        login: async () => ({ user: adminUser }),
        logout: async () => ({ ok: true }),
        getSessionUser: async () => adminUser,
      },
    })

    const response = await request(app)
      .get('/api/admin/session')
      .set('Cookie', ['token=mock-jwt'])
      .expect(200)

    expect(response.body).toMatchObject({ user: { username: 'admin', role: 'admin' } })
  })
})
