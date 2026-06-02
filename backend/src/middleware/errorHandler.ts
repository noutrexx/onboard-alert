import type { NextFunction, Request, Response } from 'express'

export function errorHandler(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  const message = error.message || 'Unexpected server error'
  const status = message.includes('geocode') || message.includes('required') ? 400 : 500

  return response.status(status).json({
    error: status === 400 ? 'bad_request' : 'internal_server_error',
    message,
  })
}
