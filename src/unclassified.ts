import { Interpreter } from './interpreter'

export interface UnclassifiedInterpreterOpts {
  __brand: never
}

export const unclassified = (
  opts: UnclassifiedInterpreterOpts = {} as UnclassifiedInterpreterOpts
): Interpreter => {
  return {
    type: 'unclassified',
    process: (input: any) => {
      return {
        fact: input,
      }
    },
  }
}
