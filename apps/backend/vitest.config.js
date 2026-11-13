import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    globals: true,
    env: {
      NODE_ENV: 'test',
      JWT_SECRET: 'test-only-jwt-secret',
      ACCESS_TOKEN_SECRET: 'test-only-access-token-secret',
    },
  },
})
