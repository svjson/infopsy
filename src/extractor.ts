import {
  FIELD_ITP_BUILDER,
  FieldInterpretationSpec,
  FieldInterpreter,
  FieldInterpreterSpec,
  FieldInterpreterSpecBuilder,
  FieldInterpreterSpecBuilderInt,
} from './field'
import { InputShape, OutputShape } from './infer'

export interface InterpretationSpec {
  [prop: string]: FieldInterpreter
}

export interface InterpretationSpecDefinition<SourceField extends string> {
  [prop: string]:
    | FieldInterpreterSpec<SourceField>
    | FieldInterpreterSpecBuilder<SourceField>
}

export interface ExtractionResult<O> {
  success: true
  result: O
}

export type Extractor<I, O> = (input: I) => ExtractionResult<O>

export const makeConcreteInterpretationSpec = <
  S extends Record<string, FieldInterpretationSpec<string>>,
  C extends Record<string, FieldInterpreterSpec<string>>,
>(
  def: S
): C => {
  return Object.entries(def).reduce((concrete, [key, fieldItp]) => {
    concrete[key] =
      FIELD_ITP_BUILDER in fieldItp
        ? (fieldItp as FieldInterpreterSpecBuilderInt<string>).build()
        : fieldItp

    return concrete
  }, {} as any) as C

  return {} as C
}

export const makeExtractor = <
  S extends Record<string, FieldInterpretationSpec<string>>,
  I extends InputShape<S> = InputShape<S>,
  O extends OutputShape<S> = OutputShape<S>,
>(
  specDef: S
): Extractor<I, O> => {
  const spec = makeConcreteInterpretationSpec(specDef)
  return (input: I) => {
    const o = Object.entries(spec).reduce((result, [prop, itp]) => {
      result[prop] = input[itp.sourceProp as keyof I]
      return result
    }, {} as any)

    return {
      success: true,
      result: o,
    } as ExtractionResult<O>
  }
}
