import { createNullTransition, FSMDefinition } from '@minifsm/core'

export const STATES = {
  READY: Symbol('ready'),
  GENERATING_POEM: Symbol('generating_poem'),
  POEM_GENERATED: Symbol('poem_generated'),
  POEM_GENERATION_ERROR: Symbol('poem_generation_error')
} as const

export type PoemPageState = typeof STATES[keyof typeof STATES]

export interface PoemPageContext {
  onGeneratePoemRequest: () => void,
  poem: {
    author: string,
    title: string,
    content: string,
  }
}

type PeomGeneratedInput = { type: 'POEM_GENERATED', poem: { author: string, title: string, content: string } }
export type PoemPageInput =
  { type: 'GENERATE_POEM_REQUEST' | 'POEM_GENERATION_ERROR' }
  | PeomGeneratedInput

function isGeneratePoemRequestCondition ({ input }: { input: PoemPageInput }): boolean {
  return input.type === 'GENERATE_POEM_REQUEST'
}

function isPoemGeneratedCondition ({ input }: { input: PoemPageInput }): boolean {
  return input.type === 'POEM_GENERATED'
}

function isPoemGenerationErrorCondition ({ input }: { input: PoemPageInput }): boolean {
  return input.type === 'POEM_GENERATION_ERROR'
}

const toGeneratingPoemTransition = {
  nextState: STATES.GENERATING_POEM,
  condition: isGeneratePoemRequestCondition,
  action: ({ context }: {
    context: PoemPageContext
    input: PoemPageInput
  }): PoemPageContext => {
    context.onGeneratePoemRequest()

    return { ...context, poem: { author: '', title: '', content: '' } }
  }
}

export const poemPageFSMDefinition: FSMDefinition<PoemPageState, PoemPageContext, PoemPageInput> = {
  [STATES.READY]: {
    transitions: [
      toGeneratingPoemTransition
    ],
    defaultTransition: createNullTransition(STATES.READY)
  },
  [STATES.POEM_GENERATION_ERROR]: {
    transitions: [toGeneratingPoemTransition],
    defaultTransition: createNullTransition(STATES.POEM_GENERATION_ERROR)
  },
  [STATES.GENERATING_POEM]: {
    transitions: [
      {
        nextState: STATES.POEM_GENERATED,
        condition: isPoemGeneratedCondition,
        action: ({ context, input }: {
          context: PoemPageContext
          input: PoemPageInput
        }): PoemPageContext => {
          const i = input as PeomGeneratedInput

          return { ...context, poem: i.poem }
        }
      },
      {
        nextState: STATES.POEM_GENERATION_ERROR,
        condition: isPoemGenerationErrorCondition,
        action: ({ context }: {
          context: PoemPageContext
          input: PoemPageInput
        }): PoemPageContext => context
      }
    ],
    defaultTransition: createNullTransition(STATES.GENERATING_POEM)
  },
  [STATES.POEM_GENERATED]: {
    transitions: [toGeneratingPoemTransition],
    defaultTransition: createNullTransition(STATES.POEM_GENERATED)
  }
}
