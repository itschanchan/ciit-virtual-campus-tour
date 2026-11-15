import { afterEach, describe, expect, it, vi } from 'vitest'
import { createAdminAuthService } from '../services/AuthService.js'

describe('Admin auth service configuration', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('requires a JWT secret', () => {
    expect(() => createAdminAuthService({ jwtSecret: '' })).toThrow('JWT_SECRET is required.')
  })

  it('reads JWT_SECRET from the environment at call time', () => {
    vi.stubEnv('JWT_SECRET', '')
    expect(() => createAdminAuthService()).toThrow('JWT_SECRET is required.')

    vi.stubEnv('JWT_SECRET', 'test-only-jwt-secret')
    const service = createAdminAuthService()

    expect(typeof service.login).toBe('function')
    expect(typeof service.logout).toBe('function')
    expect(typeof service.getSessionUser).toBe('function')
  })
})
