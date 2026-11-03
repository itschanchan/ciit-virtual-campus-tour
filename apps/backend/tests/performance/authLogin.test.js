import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../../app.js'

describe('Performance: Login response time (SC-001)', () => {
  it('login completes within 1 minute', async () => {
    const app = createApp({
      corsOrigins: ['http://localhost:5173'],
    })

    const start = Date.now()
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'password123' })
    const duration = Date.now() - start

    expect(response.status).toBe(200)
    expect(duration).toBeLessThan(60000) // 1 minute in milliseconds
  })
})
