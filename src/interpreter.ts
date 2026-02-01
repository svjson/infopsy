export interface InterpreterResult {
  fact: any
}

export type Interpreter = {
  type: string
  process: (input: any) => InterpreterResult
}
