import { describe, expect, it } from 'vitest'
import { validateEnv } from '../config/env.js'

const validSource = {
  NODE_ENV: 'test',
  PORT: '5050',
  MONGODB_URI: 'mongodb://127.0.0.1:27017/ciit-test',
  CORS_ORIGIN: 'http://localhost:5173,http://127.0.0.1:5173',
}

describe('environment validation', () => {
  it('accepts a complete configuration', () => {
    const config = validateEnv(validSource)

    expect(config).toEqual({
      port: 5050,
      nodeEnv: 'test',
      mongoUri: 'mongodb://127.0.0.1:27017/ciit-test',
      corsOrigins: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    })
  })

  it('requires a MongoDB URI', () => {
    expect(() => validateEnv({ ...validSource, MONGODB_URI: '' })).toThrow(
      'MONGODB_URI is required.',
    )
  })

  it('rejects an invalid port', () => {
    expect(() => validateEnv({ ...validSource, PORT: 'not-a-port' })).toThrow(
      'PORT must be an integer between 1 and 65535.',
    )
  })

  it('rejects an unsupported environment', () => {
    expect(() => validateEnv({ ...validSource, NODE_ENV: 'staging' })).toThrow(
      'NODE_ENV must be development, test, or production.',
    )
  })

  it('requires at least one CORS origin', () => {
    expect(() => validateEnv({ ...validSource, CORS_ORIGIN: ' , ' })).toThrow(
      'CORS_ORIGIN must contain at least one allowed origin.',
    )
  })
})
