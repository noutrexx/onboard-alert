import type { NextFunction, Request, Response } from 'express'
import type { ZodSchema } from 'zod'

type ParsedRequestShape = {
  body?: unknown
  params?: unknown
  query?: unknown
}

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

    const parsed = result.data as ParsedRequestShape
    request.body = parsed.body ?? request.body
    request.params = (parsed.params ?? request.params) as typeof request.params
    request.query = (parsed.query ?? request.query) as typeof request.query

    return next()
  }
}
