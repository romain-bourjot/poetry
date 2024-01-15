import { z } from 'zod'
import { adaptController } from '../../common/controllers/api-gateway'
import { createSanitizer } from '../../common/controllers/sanitizer'
import { createValidator } from '../../common/controllers/validator'
import { LoggerService } from '../../common/services/logger-service/logger-service'
import { PoemService } from '../../common/services/poem-service/poem-service'
import { assertNever, type Either } from '../../common/types/either'
import {
  CreatePoemUseCase,
  type CreatePoemUseCaseError
} from '../../common/use-cases/poem/create-poem/create-poem.use-case'

const bodySchema = z.object({})
const paramsSchema = z.object({})
const querySchema = z.object({})

const resultBodySchema = z.object({
  title: z.string(),
  author: z.string(),
  content: z.string()
})

type Body = z.infer<typeof bodySchema>
type Params = z.infer<typeof paramsSchema>
type Query = z.infer<typeof querySchema>

type ResultBody = z.infer<typeof resultBodySchema>
type ResultFailure = CreatePoemUseCaseError

const validator = createValidator({ bodySchema, paramsSchema, querySchema })
const sanitizer = createSanitizer({ resultBodySchema })

const loggerService = new LoggerService({ name: 'poetry', level: 'trace' })
const poemService = new PoemService({ loggerService })

const createPoemUseCase = new CreatePoemUseCase({ loggerService, poemService })

function errorHandler (error: ResultFailure): { statusCode: number, body: string } {
  loggerService.error(error, 'poetry_createPoemController_error')

  switch (error.type) {
    case 'CREATE_POEM_ERROR':
      return { statusCode: 500, body: JSON.stringify({ error: 'UNABLE_TO_CREATE_POEM' }) }
    default:
      assertNever(error.type)
      loggerService.error(error, 'poetry_createPoemController_unexpectedError')
      return { statusCode: 500, body: JSON.stringify({ error: 'UNEXPECTED_ERROR' }) }
  }
}

async function controller ({
  body,
  params,
  query
}: { body: Body, params: Params, query: Query }): Promise<Either<Record<string, any> & ResultBody, ResultFailure>> {
  loggerService.info({ body, params, query }, 'poetry_createPoemController_invoke')

  const createPoemResult = await createPoemUseCase.handle()

  if (createPoemResult.isFailure) {
    return { isFailure: true, failure: createPoemResult.failure }
  }

  return { isFailure: false, value: createPoemResult.value }
}

export const handler = adaptController({
  validator,
  sanitizer,
  controller,
  errorHandler
})
