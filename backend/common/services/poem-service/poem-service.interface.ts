import { type Either } from '../../types/either'
import { type Poem } from '../../types/poem'

export interface GeneratePoemError {
  type: 'GENERATE_POEM_VALIDATION_ERROR' | 'GENERATE_POEM_UNEXPECTED_ERROR'
  details: Record<string, any>
}

export interface PoemServiceInterface {
  generatePoem: () => Promise<Either<Poem, GeneratePoemError>>
}
