import { FieldAnalysis, Interpreter, InterpreterResult } from './interpreter'

export const bool = (): Interpreter => {
  return {
    type: 'boolean',
    process: (input: FieldAnalysis): InterpreterResult => {
      return input.segments
        .map((s) => ({
          kind: 'boolean',
          start: s.start,
          end: s.end,
          fact: s.content && ['1', 'true', 't'].includes(s.content.trim()),
        }))
        .filter(Boolean) as unknown as InterpreterResult
    },
  }
}
