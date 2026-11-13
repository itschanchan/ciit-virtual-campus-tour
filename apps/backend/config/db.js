// Handshake between the app and the database. The server must not accept
// requests until this connection succeeds.
import dns from 'node:dns'
import mongoose from 'mongoose'

let isConnected = false

function applyConfiguredDnsServers() {
  const configured = process.env.MONGODB_DNS_SERVERS

  if (!configured) {
    return
  }

  const servers = configured
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean)

  if (servers.length > 0) {
    dns.setServers(servers)
  }
}

export async function connectDB({ uri, dbName } = {}) {
  const resolvedUri = uri ?? process.env.MONGODB_URI
  const resolvedDbName = dbName ?? process.env.MONGODB_NAME

  if (!resolvedUri) {
    throw new Error('MONGODB_URI is required.')
  }

  if (
    !resolvedUri.startsWith('mongodb://') &&
    !resolvedUri.startsWith('mongodb+srv://')
  ) {
    throw new Error(
      "MONGODB_URI must start with 'mongodb://' or 'mongodb+srv://'.",
    )
  }

  applyConfiguredDnsServers()

  try {
    await mongoose.connect(resolvedUri, { dbName: resolvedDbName })
    isConnected = true
  } catch (error) {
    isConnected = false
    throw new Error(
      `MongoDB connection failed (${error.name}). ${error.message}`,
    )
  }
}

export function isDatabaseReady() {
  return isConnected
}

export default connectDB
