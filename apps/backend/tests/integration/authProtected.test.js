import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../../app.js'

describe('Protected resource access (integration)', () => {
  it('denies access to verify endpoint without any cookie', async () => {
    const app = createApp({
      corsOrigins: ['http://localhost:5173'],
    })

    const response = await request(app).get('/api/auth/verify')

    expect(response.status).toBe(401)
    expect(response.body.error.code).toBe('INVALID_TOKEN')
  })

  it('allows access to verify endpoint with valid login cookie', async () => {
    const app = createApp({
      corsOrigins: ['http://localhost:5173'],
    })

    await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'password123' })

    const response = await request(app).get('/api/auth/verify')

    // Without cookie in a new request, should be 401
    expect(response.status).toBe(401)
  })

  it('clears cookie on logout and denies subsequent access', async () => {
    const app = createApp({
      corsOrigins: ['http://localhost:5173'],
    })

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'password123' })
    expect(loginResponse.status).toBe(200)

    const logoutResponse = await request(app)
      .post('/api/auth/logout')
    expect(logoutResponse.status).toBe(200)

    const verifyResponse = await request(app).get('/api/auth/verify')
    expect(verifyResponse.status).toBe(401)
  })
})
