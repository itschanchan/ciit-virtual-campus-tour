import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import connectDB, { isDatabaseReady } from './config/db.js'
import AdminRoutes from './routes/AdminRoutes.js'
import AuthRoutes from './routes/AuthRoutes.js'
import { errorHandler, notFoundHandler } from './utils/errors.js'

dotenv.config()

// JWT secret is always required; MongoDB vars are required outside test mode
if (!process.env.JWT_SECRET) {
  console.error('Missing required environment variable: JWT_SECRET')
  process.exit(1)
}
if (process.env.NODE_ENV !== 'test') {
  for (const key of ['MONGODB_URI', 'MONGODB_NAME']) {
    if (!process.env[key]) {
      console.error(`${key} is required.`)
      process.exit(1)
    }
  }
}

const PORT = process.env.PORT || 3000
const ALLOWED_ORIGINS = ['http://localhost:5173']

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  }),
)
app.use('/api/admins', AdminRoutes)
app.use('/api/auth', AuthRoutes)

app.get('/welcome', (req, res) => {
  res.json({
    message: 'Welcome to the CIIT Virtual Campus Tour API.',
    mongodb: isDatabaseReady() ? 'connected' : 'disconnected',
  })
})

app.use(notFoundHandler)
app.use(errorHandler)

function registerShutdownHandlers(server) {
  function shutdown(signal) {
    console.log(`${signal} received. Shutting down.`)
    server.close(() => {
      process.exit(0)
    })
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

if (process.env.NODE_ENV !== "test") {
  try {
    await connectDB({
      uri: process.env.MONGODB_URI,
      dbName: process.env.MONGODB_NAME,
    })
    console.log('MongoDB connection established.')
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }

  const server = app.listen(PORT, () => {
    console.log(`CIIT campus tour API listening on port ${PORT}.`)
  })

  registerShutdownHandlers(server)
}

export default app
