import { connectDatabase } from './config/db.js'
import { loadEnv } from './config/env.js'
import { createApp } from './app.js'

let config

try {
  config = loadEnv()
} catch (error) {
  console.error(`Configuration error: ${error.message}`)
  process.exit(1)
}

try {
  await connectDatabase(config.mongoUri)
  console.log('MongoDB connection established.')
} catch (error) {
  console.warn(`MongoDB is unavailable: ${error.message}`)
}

const app = createApp({ corsOrigins: config.corsOrigins })

const server = app.listen(config.port, () => {
  console.log(`CIIT campus tour API listening on port ${config.port}.`)
})

function shutdown(signal) {
  console.log(`${signal} received. Shutting down.`)
  server.close(() => {
    process.exit(0)
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
