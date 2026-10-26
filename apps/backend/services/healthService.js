import { isDatabaseReady } from '../config/db.js'

export function createHealthService({ databaseReady = isDatabaseReady } = {}) {
  return {
    getStatus() {
      const ready = databaseReady()

      if (!ready) {
        return {
          status: 'unavailable',
          timestamp: new Date().toISOString(),
        }
      }

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
      }
    },
  }
}
