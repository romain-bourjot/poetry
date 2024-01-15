import axios from 'axios'
import { z } from 'zod'
import { type Either } from '../../types/either'
import { type Poem } from '../../types/poem'
import { type LoggerServiceInterface } from '../logger-service/logger-service.interface'
import { type GeneratePoemError, type PoemServiceInterface } from './poem-service.interface'

const responseSchema = z.array(z.object({
  title: z.string(),
  author: z.string(),
  lines: z.string().array()
})).nonempty()

export class PoemService implements PoemServiceInterface {
  private readonly loggerService: LoggerServiceInterface

  constructor ({ loggerService }: { loggerService: LoggerServiceInterface }) {
    this.loggerService = loggerService
  }

  async generatePoem (): Promise<Either<Poem, GeneratePoemError>> {
    try {
      const a = await axios.get('https://poetrydb.org/random/1')

      const validationResult = responseSchema.safeParse(a.data)

      if (!validationResult.success) {
        this.loggerService.error({ error: validationResult.error }, 'poetry_poemService_generatePoem_validationError')
        return { isFailure: true, failure: { type: 'GENERATE_POEM_VALIDATION_ERROR', details: validationResult.error } }
      }

      const rawPoem = validationResult.data[0]
      this.loggerService.info({ author: rawPoem.author, title: rawPoem.title }, 'poetry_poemService_generatePoem_success')

      return {
        isFailure: false,
        value: { author: rawPoem.author, title: rawPoem.title, content: rawPoem.lines.join('\n') }
      }
    } catch (error) {
      this.loggerService.error({ error }, 'poetry_poemService_generatePoem_error')
      return { isFailure: true, failure: { type: 'GENERATE_POEM_UNEXPECTED_ERROR', details: error } }
    }
  }
}
