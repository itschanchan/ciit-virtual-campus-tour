import { createHealthService } from '../services/healthService.js'

export function createHealthController(healthService = createHealthService()) {
  return {
    getHealth(req, res) {
      const status = healthService.getStatus()

      if (status.status !== 'ok') {
        res.status(503).json({
          error: {
            code: 'SERVICE_UNAVAILABLE',
            message: 'The service is temporarily unavailable.',
          },
        })
        return
      }

      res.status(200).json(status)
    },
  }
}
