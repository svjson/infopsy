export type OutputShape<S extends Record<string, FieldInterpretationSpec<string>>> = {
  [K in keyof S]: unknown
}

export type InputKeys<S extends Record<string, FieldInterpretationSpec<string>>> =
  S[keyof S] extends FieldInterpretationSpec<infer K> ? K : never

export type InputShape<S extends Record<string, FieldInterpretationSpec<string>>> = {
  [K in InputKeys<S>]: unknown
}
