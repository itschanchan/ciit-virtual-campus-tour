import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import { createHealthService } from './services/healthService.js'
import { createHealthRoutes } from './routes/healthRoutes.js'
import { createAuthRoutes } from './routes/authRoutes.js'
import { errorHandler, notFoundHandler } from './utils/errors.js'

dotenv.config()

export function createApp({
  corsOrigins = ['http://localhost:5173'],
  healthService = createHealthService(),
} = {}) {
  const app = express()

  app.disable('x-powered-by')
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || corsOrigins.includes(origin)) {
          callback(null, true)
          return
        }

        callback(new Error('Origin is not allowed.'))
      },
    }),
  )
  app.use(express.json({ limit: '100kb' }))
  app.use(cookieParser())

  app.use('/api/health', createHealthRoutes(healthService))
  app.use('/api/auth', createAuthRoutes())
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
