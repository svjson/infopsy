import { FieldAnalysis, Interpreter } from './interpreter'

export interface UnclassifiedInterpreterOpts {
  __brand: never
}

export const unclassified = (
  opts: UnclassifiedInterpreterOpts = {} as UnclassifiedInterpreterOpts
): Interpreter => {
  return {
    type: 'unclassified',
    process: (input: FieldAnalysis) => {
      return input.segments
        .map((s) => {
          return {
            start: s.start,
            end: s.end,
            kind: 'unclassified',
            fact: s.content?.trim(),
          }
        })
        .filter((c) => c.fact !== undefined && c.fact.length)
    },
  }
}
