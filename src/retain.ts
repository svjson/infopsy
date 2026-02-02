import { FieldAnalysis, Interpreter, InterpreterResult } from './interpreter'

export const RETAIN: Interpreter = {
  type: 'retain',
  process: (input: FieldAnalysis): InterpreterResult => {
    if (typeof input.raw !== 'undefined') {
      return [
        {
          fact: input.raw,
          start: 0,
          end: input.raw.length,
          kind: 'raw',
        },
      ]
    }
    return []
  },
}
