import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../../app.js'

describe('GET /api/auth/verify (contract - protected)', () => {
  it('returns 401 when no JWT cookie is present', async () => {
    const app = createApp({
      corsOrigins: ['http://localhost:5173'],
    })

    const response = await request(app).get('/api/auth/verify')

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('error')
  })

  it('returns 200 and user data when valid JWT cookie is present', async () => {
    const app = createApp({
      corsOrigins: ['http://localhost:5173'],
    })

    // First log in to get a cookie
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'password123' })

    expect(loginResponse.status).toBe(200)

    // Then access the protected endpoint with the cookie
    const response = await request(app)
      .get('/api/auth/verify')
      .set('Cookie', loginResponse.headers['set-cookie'])

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('authenticated', true)
    expect(response.body.user).toHaveProperty('id')
    expect(response.body.user).toHaveProperty('email')
  })

  it('returns 401 when JWT cookie is expired or invalid', async () => {
    const app = createApp({
      corsOrigins: ['http://localhost:5173'],
    })

    const response = await request(app)
      .get('/api/auth/verify')
      .set('Cookie', 'auth_token=invalid.token.string')

    expect(response.status).toBe(401)
  })
})
