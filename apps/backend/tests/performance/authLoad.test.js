import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../../app.js'

describe('Reliability: Login success rate (SC-002)', () => {
  it('at least 95% of valid login attempts succeed', async () => {
    const app = createApp({
      corsOrigins: ['http://localhost:5173'],
    })

    const totalAttempts = 20
    let successes = 0

    for (let i = 0; i < totalAttempts; i++) {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@example.com', password: 'password123' })

      if (response.status === 200) {
        successes += 1
      }
    }

    const successRate = (successes / totalAttempts) * 100
    expect(successRate).toBeGreaterThanOrEqual(95)
  })
})
