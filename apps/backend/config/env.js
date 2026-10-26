import dotenv from 'dotenv'

dotenv.config()

const VALID_ENVIRONMENTS = new Set(['development', 'test', 'production'])

function parsePort(value) {
  const port = Number(value ?? 5000)

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.')
  }

  return port
}

function parseOrigins(value) {
  const origins = String(value ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  if (origins.length === 0) {
    throw new Error('CORS_ORIGIN must contain at least one allowed origin.')
  }

  return origins
}

export function validateEnv(source = process.env) {
  const nodeEnv = source.NODE_ENV ?? 'development'

  if (!VALID_ENVIRONMENTS.has(nodeEnv)) {
    throw new Error('NODE_ENV must be development, test, or production.')
  }

  const mongoUri = source.MONGODB_URI

  if (!mongoUri || mongoUri.trim().length === 0) {
    throw new Error('MONGODB_URI is required.')
  }

  return {
    port: parsePort(source.PORT),
    nodeEnv,
    mongoUri,
    corsOrigins: parseOrigins(source.CORS_ORIGIN),
  }
}

export function loadEnv() {
  return validateEnv(process.env)
}
