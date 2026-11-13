import { afterEach, describe, expect, it, vi } from 'vitest'
import mongoose from 'mongoose'
import connectDB from '../config/db.js'

describe('connectDB', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('requires a MongoDB URI', async () => {
    await expect(connectDB({ uri: '' })).rejects.toThrow('MONGODB_URI is required.')
  })

  it('rejects an invalid URI scheme', async () => {
    await expect(connectDB({ uri: 'invalid-scheme://example' })).rejects.toThrow(
      "MONGODB_URI must start with 'mongodb://' or 'mongodb+srv://'.",
    )
  })

  it('reads MONGODB_URI from the environment at call time', async () => {
    const uri = 'mongodb://127.0.0.1:27017/ciit-campus-tour'
    const connectSpy = vi.spyOn(mongoose, 'connect').mockResolvedValue({})

    vi.stubEnv('MONGODB_URI', uri)
    vi.stubEnv('MONGODB_NAME', 'test-db')

    await connectDB()

    expect(connectSpy).toHaveBeenCalledWith(uri, { dbName: 'test-db' })
  })

  it('does not expose the URI when the connection fails', async () => {
    const uri = 'mongodb://user:pass@localhost:27017/test'
    vi.spyOn(mongoose, 'connect').mockRejectedValue(new Error('connection failed'))

    await expect(connectDB({ uri, dbName: 'test' })).rejects.toThrow(
      'MongoDB connection failed (Error).',
    )

    try {
      await connectDB({ uri, dbName: 'test' })
    } catch (error) {
      expect(error.message).not.toContain(uri)
      expect(error.message).not.toContain('user:pass')
    }
  })
})
