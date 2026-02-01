import { FieldInterpretationSpec } from './field'
import { InfopsyConfig } from './infopsy'

export type AnyFieldSpec<K extends string = string> = FieldInterpretationSpec<any, K>

export type OutputShape<S extends Record<string, AnyFieldSpec>> = {
  [K in keyof S]: unknown
}

export type InputKeys<S extends Record<string, AnyFieldSpec>> =
  S[keyof S] extends FieldInterpretationSpec<any, infer K> ? K : never

export type InputShape<S extends Record<string, AnyFieldSpec>> = {
  [K in InputKeys<S>]: unknown
}
