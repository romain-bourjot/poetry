import { type LoggerServiceInterface } from '../../../services/logger-service/logger-service.interface'
import { type PoemServiceInterface } from '../../../services/poem-service/poem-service.interface'
import { type Either } from '../../../types/either'

export interface CreatePoemUseCaseResult {
  title: string
  author: string
  content: string
}

export interface CreatePoemUseCaseError {
  type: 'CREATE_POEM_ERROR'
  details: Record<string, any>
}

export class CreatePoemUseCase {
  private readonly loggerService: LoggerServiceInterface
  private readonly poemService: PoemServiceInterface

  constructor ({
    loggerService,
    poemService
  }: { loggerService: LoggerServiceInterface, poemService: PoemServiceInterface }) {
    this.loggerService = loggerService
    this.poemService = poemService
  }

  async handle (): Promise<Either<CreatePoemUseCaseResult, CreatePoemUseCaseError>> {
    const poemResult = await this.poemService.generatePoem()

    if (poemResult.isFailure) {
      this.loggerService.error({ failure: poemResult.failure }, 'poetry_createPoemUseCase_error')
      return { isFailure: true, failure: { type: 'CREATE_POEM_ERROR', details: poemResult.failure } }
    }

    this.loggerService.info({
      poem: {
        author: poemResult.value.author,
        title: poemResult.value.title
      }
    }, 'poetry_createPoemUseCase_success')

    return {
      isFailure: false,
      value: poemResult.value
    }
  }
}
