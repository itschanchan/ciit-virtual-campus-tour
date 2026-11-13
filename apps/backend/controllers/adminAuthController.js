import { AppError } from '../utils/errors.js'
import { attachSessionCookie, clearSessionCookie, readSessionToken } from '../utils/auth.js'

export function createAdminAuthController(adminAuthService) {
  return {
    async login(req, res, next) {
      try {
        const { username, email, password } = req.body ?? {}
        const result = await adminAuthService.login({
          username,
          email,
          password,
        })

        attachSessionCookie(res, result.token)

        res.status(200).json({
          message: 'Login successful',
          user: result.user,
        })
      } catch (error) {
        next(
          error instanceof AppError
            ? error
            : new AppError('Invalid credentials.', 401, 'INVALID_CREDENTIALS'),
        )
      }
    },

    async logout(req, res, next) {
      try {
        await adminAuthService.logout()
        clearSessionCookie(res)
        res.status(200).json({ message: 'Logout successful' })
      } catch (error) {
        next(error)
      }
    },

    async getSession(req, res, next) {
      try {
        const token = readSessionToken(req)
        const user = await adminAuthService.getSessionUser(token)

        if (!user) {
          throw new AppError('Unauthorized.', 401, 'UNAUTHORIZED')
        }

        res.status(200).json({ user })
      } catch (error) {
        next(error)
      }
    },
  }
}
