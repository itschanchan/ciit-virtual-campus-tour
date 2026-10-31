import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../app.js'

const timestamp = '2026-10-26T00:00:00.000Z'

describe('GET /api/health', () => {
  it('returns the healthy service shape', async () => {
    const app = createApp({
      corsOrigins: ['http://localhost:5173'],
      healthService: {
        getStatus: () => ({ status: 'ok', timestamp }),
      },
    })

    const response = await request(app).get('/api/health')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ status: 'ok', timestamp })
  })

  it('returns a safe 503 error when the database is unavailable', async () => {
    const app = createApp({
      corsOrigins: ['http://localhost:5173'],
      healthService: {
        getStatus: () => ({ status: 'unavailable', timestamp }),
      },
    })

    const response = await request(app).get('/api/health')

    expect(response.status).toBe(503)
    expect(response.body).toEqual({
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'The service is temporarily unavailable.',
      },
    })
  })

  it('returns a safe not-found response', async () => {
    const app = createApp({ corsOrigins: ['http://localhost:5173'] })

    const response = await request(app).get('/api/missing')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found.',
      },
    })
  })
})
