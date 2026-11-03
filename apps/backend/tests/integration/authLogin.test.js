import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../../app.js'

describe('POST /api/auth/login (integration)', () => {
  it('authenticates a user and returns a secure cookie', async () => {
    const app = createApp({
      corsOrigins: ['http://localhost:5173'],
    })

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'password123' })

    expect(response.status).toBe(200)
    const cookies = response.headers['set-cookie']
    expect(cookies).toBeDefined()
    expect(cookies.some((c) => c.startsWith('auth_token='))).toBe(true)
    expect(cookies.some((c) => c.includes('HttpOnly'))).toBe(true)
    expect(cookies.some((c) => c.includes('SameSite=Strict'))).toBe(true)
  })

  it('denies access to protected endpoint without cookie', async () => {
    const app = createApp({
      corsOrigins: ['http://localhost:5173'],
    })

    const response = await request(app).get('/api/auth/verify')

    expect(response.status).toBe(401)
  })
})
