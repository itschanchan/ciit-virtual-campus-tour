import { describe, expect, it } from 'vitest'

describe('AdminRoutes route handler registration', () => {
  it('imports AdminRoutes.js without throwing "argument handler must be a function"', async () => {
    // Importing AdminRoutes.js triggers Express route registration at module load.
    // If any handler (e.g., adminController.login) is undefined,
    // Express throws TypeError: argument handler must be a function.
    await expect(import('../routes/AdminRoutes.js')).resolves.toBeDefined()
  })

  it('every route handler referenced by AdminRoutes exists as a function', async () => {
    const adminController = (await import('../controllers/AdminController.js')).default
    const expectedHandlers = [
      'getMyProfile',
      'getAdminDetails',
      'createAdmin',
      'updateAdmin',
      'deleteAdmin',
      'changePassword',
    ]
    for (const name of expectedHandlers) {
      expect(typeof adminController[name]).toBe('function')
    }
  })
})
