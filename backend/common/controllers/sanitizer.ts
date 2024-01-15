import { type z, type ZodType } from 'zod'
import { type Sanitizer } from './api-gateway'

export function createSanitizer<ResultBodySchema extends ZodType> ({
  resultBodySchema
}: {
  resultBodySchema: ResultBodySchema
}): Sanitizer<Record<string, string> & z.infer<ResultBodySchema>> {
  return (result: z.infer<ResultBodySchema>): { statusCode: number, body: string } => {
    const validated = resultBodySchema.safeParse(result)
    if (!validated.success) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          type: ''
        })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: validated.data
      })
    }
  }
}
