import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import * as indexModule from '../index.js'

const backendDir = fileURLToPath(new URL('..', import.meta.url))

function runImport(env) {
  const script = "import('./index.js').then((module) => console.log(typeof module.default))"

  return spawnSync(process.execPath, ['--input-type=module', '-e', script], {
    cwd: backendDir,
    encoding: 'utf8',
    env: { ...process.env, ...env },
    timeout: 15000,
  })
}

describe('startup behavior', () => {
  it('exports only the default Express app', () => {
    expect(typeof indexModule.default).toBe('function')
    expect(indexModule.createApp).toBeUndefined()
    expect(indexModule.readPort).toBeUndefined()
    expect(indexModule.readNodeEnv).toBeUndefined()
  })

  it('does not start a server when imported with NODE_ENV=test', () => {
    const result = runImport({
      NODE_ENV: 'test',
      JWT_SECRET: 'test-only-jwt-secret',
      MONGODB_URI: '',
    })

    expect(result.status).toBe(0)
    expect(result.stdout.trim()).toBe('function')
    expect(result.stderr).not.toContain('CIIT campus tour API listening')
    expect(result.stderr).not.toContain('MongoDB connection established')
  })

  it('exits before listening when MONGODB_URI is missing', () => {
    const result = runImport({
      NODE_ENV: 'development',
      JWT_SECRET: 'test-only-jwt-secret',
      MONGODB_URI: '',
    })

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('MONGODB_URI is required.')
    expect(result.stdout).not.toContain('CIIT campus tour API listening')
    expect(result.stdout).not.toContain('MongoDB connection established')
  })
})
