import { setServers } from 'node:dns'
import mongoose from 'mongoose'

export function configureMongoDns(value = process.env.MONGODB_DNS_SERVERS) {
  if (!value) {
    return
  }

  const servers = value
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean)

  if (servers.length === 0) {
    throw new Error('MONGODB_DNS_SERVERS must contain at least one DNS server.')
  }

  setServers(servers)
}

export async function connectDatabase(uri) {
  if (!uri) {
    throw new Error('A MongoDB URI is required.')
  }

  mongoose.set('strictQuery', true)
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  })

  return mongoose.connection
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }
}

export function isDatabaseReady() {
  return mongoose.connection.readyState === 1
}
