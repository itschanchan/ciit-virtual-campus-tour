import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../../app.js'

describe('POST /api/auth/login (contract)', () => {
  it('issues a JWT cookie on valid credentials', async () => {
    const app = createApp({
      corsOrigins: ['http://localhost:5173'],
    })

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'password123' })

    expect(response.status).toBe(200)
    expect(response.headers['set-cookie']).toBeDefined()
    expect(response.body).toHaveProperty('message')
    expect(response.body).toHaveProperty('user')
    expect(response.body.user).toHaveProperty('id')
    expect(response.body.user).toHaveProperty('email')
  })

  it('rejects invalid credentials with 401', async () => {
    const app = createApp({
      corsOrigins: ['http://localhost:5173'],
    })

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'wrongpassword' })

    expect(response.status).toBe(401)
    expect(response.headers['set-cookie']).toBeUndefined()
  })

  it('rejects missing credentials with 400', async () => {
    const app = createApp({
      corsOrigins: ['http://localhost:5173'],
    })

    const response = await request(app)
      .post('/api/auth/login')
      .send({})

    expect(response.status).toBe(400)
  })
})
