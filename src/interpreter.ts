/**
 * A "claimed" portion of the original input.
 *
 * The region delimited by `start` and `end` includes the entire part
 * of the original segment that the responsible Interpreter considers
 * to be the source of the extracted fact.
 *
 * The actual extracted fact may be of a different length and format.
 */
export type Claim = {
  /**
   * The kind/category of the claim.
   *
   * This is decided by the Interpreter responsible for highlighting
   * this claim.
   */
  kind?: string
  /**
   * The actual fact that has been claimed.
   */
  fact: any
  /**
   * The start index/offset of the claim in the original input.
   */
  start: number
  /**
   * The end index/offset of the claim in the original input.
   */
  end: number
}

/**
 * A segment of the raw interpreter input.
 */
export type Segment = {
  start: number
  end: number
  kind?: string
  content?: string
  claim: Claim[]
}

export type FieldAnalysis = {
  raw?: string
  segments: Segment[]
  claims: Claim[]
}

export type InterpreterInput = FieldAnalysis

export type FactSource = {
  start: number
  end: number
  literal: string
}

export type InterpreterResult = Claim[]

export type Interpreter = {
  type: string
  process: (input: FieldAnalysis) => InterpreterResult
}
