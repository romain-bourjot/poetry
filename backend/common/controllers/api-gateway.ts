import { type APIGatewayEvent, type APIGatewayProxyResult, type Context } from 'aws-lambda'
import {
  type APIGatewayProxyEventHeaders,
  type APIGatewayProxyEventPathParameters,
  type APIGatewayProxyEventQueryStringParameters
} from 'aws-lambda/trigger/api-gateway-proxy'
import { type Either } from '../types/either'

export type APIGatewayController = (event: APIGatewayEvent, context: Context) => Promise<APIGatewayProxyResult>
type Controller<Body, Params, Query, ResultBody, ResultFailure> = ({ body, headers, params, query }: {
  body: Body
  headers: APIGatewayProxyEventHeaders
  params: Params
  query: Query
}) => Promise<Either<Record<string, string> & ResultBody, ResultFailure>>
export type Validator<Body, Params, Query, ValidationFailure> = (args: {
  body: string | null
  params: APIGatewayProxyEventPathParameters | null
  query: APIGatewayProxyEventQueryStringParameters | null
}) => Either<{ body: Body, params: Params, query: Query }, ValidationFailure>
export type Sanitizer<ResultBody> = (result: ResultBody) => { statusCode: number, body: string }

export function adaptController<Body, Params, Query, ResultBody, ResultFailure, ValidationFailure> ({
  controller,
  validator,
  sanitizer,
  errorHandler
}: {
  validator: Validator<Body, Params, Query, ValidationFailure>
  sanitizer: Sanitizer<ResultBody>
  errorHandler: (failure: ResultFailure) => { statusCode: number, body: string }
  controller: Controller<Body, Params, Query, ResultBody, ResultFailure>
}): APIGatewayController {
  return async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const validationResult = validator({
      body: event.body,
      params: event.pathParameters,
      query: event.queryStringParameters
    })
    if (validationResult.isFailure) {
      return { statusCode: 400, body: JSON.stringify({ error: validationResult.failure }) }
    }
    const { body, query, params } = validationResult.value

    try {
      const controllerResult = await controller({ headers: event.headers, body, query, params })
      if (controllerResult.isFailure) {
        return errorHandler(controllerResult.failure)
      }

      return sanitizer(controllerResult.value)
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify({ error: { message: 'UNEXPECTED_CONTROLLER_ERROR', details: error } }) }
    }
  }
}
