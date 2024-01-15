import {
  type APIGatewayProxyEventPathParameters,
  type APIGatewayProxyEventQueryStringParameters
} from 'aws-lambda/trigger/api-gateway-proxy'
import { type z, type ZodType } from 'zod'
import { type Either } from '../types/either'
import { type Validator } from './api-gateway'

export interface ValidationFailure {
  type: 'validation'
  details: { message: string, error: any }
}

export function createValidator<BodySchema extends ZodType, ParamsSchema extends ZodType, QuerySchema extends ZodType> ({
  bodySchema,
  paramsSchema,
  querySchema
}: {
  bodySchema: BodySchema
  paramsSchema: ParamsSchema
  querySchema: QuerySchema
}): Validator<z.infer<BodySchema>, z.infer<ParamsSchema>, z.infer<QuerySchema>, ValidationFailure> {
  return ({ body, params, query }: {
    body: string | null
    params: APIGatewayProxyEventPathParameters | null
    query: APIGatewayProxyEventQueryStringParameters | null
  }): Either<{ body: z.infer<BodySchema>, params: z.infer<ParamsSchema>, query: z.infer<QuerySchema> }, ValidationFailure> => {
    try {
      const bodyValidation = bodySchema.safeParse(JSON.parse(body ?? '{}'))
      const paramsValidation = paramsSchema.safeParse(params ?? {})
      const queryValidation = querySchema.safeParse(query ?? {})

      if (!bodyValidation.success) {
        return {
          isFailure: true,
          failure: {
            type: 'validation',
            details: {
              message: 'invalid_body',
              error: bodyValidation.error
            }
          }
        }
      }
      const bodyResult = bodyValidation.data

      if (!paramsValidation.success) {
        return {
          isFailure: true,
          failure: {
            type: 'validation',
            details: {
              message: 'invalid_params',
              error: paramsValidation.error
            }
          }
        }
      }
      const paramsResult = paramsValidation.data

      if (!queryValidation.success) {
        return {
          isFailure: true,
          failure: {
            type: 'validation',
            details: {
              message: 'invalid_body',
              error: queryValidation.error
            }
          }
        }
      }
      const queryResult = queryValidation.data

      return {
        isFailure: false,
        value: {
          body: bodyResult,
          query: queryResult,
          params: paramsResult
        }
      }
    } catch (error) {
      return {
        isFailure: true,
        failure: {
          type: 'validation',
          details: {
            message: 'unexpected',
            error
          }
        }
      }
    }
  }
}
