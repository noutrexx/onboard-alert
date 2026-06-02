import type { NextFunction, Request, Response } from 'express'
import type { ZodSchema } from 'zod'

export function validateRequest(schema: ZodSchema) {
  return (request: Request, response: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: request.body,
      params: request.params,
      query: request.query,
    })

    if (!result.success) {
      return response.status(400).json({
        error: 'validation_error',
        issues: result.error.issues,
      })
    }

    return next()
  }
}
