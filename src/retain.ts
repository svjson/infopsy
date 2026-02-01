import { Interpreter } from './interpreter'

export const RETAIN: Interpreter = {
  type: 'retain',
  process: (input: any) => {
    return {
      fact: input,
    }
  },
}
