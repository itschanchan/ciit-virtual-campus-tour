export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
  }
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'The requested resource was not found.',
    },
  })
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    next(error)
    return
  }

  const statusCode = error.statusCode ?? 500
  const code = error.code ?? 'INTERNAL_ERROR'
  const message =
    statusCode >= 500 ? 'The service encountered an unexpected problem.' : error.message

  res.status(statusCode).json({
    error: {
      code,
      message,
    },
  })
}
