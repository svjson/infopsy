import {
  FIELD_ITP_BUILDER,
  FieldInterpretationSpec,
  FieldInterpreter,
  FieldInterpreterSpec,
  FieldInterpreterSpecBuilder,
  FieldInterpreterSpecBuilderInt,
} from './field'
import { InputShape, OutputShape } from './infer'
import { InfopsyConfig } from './infopsy'

export interface InterpretationSpec {
  [prop: string]: FieldInterpreter
}

export interface InterpretationSpecDefinition<
  SourceField extends string,
  CFG extends InfopsyConfig = InfopsyConfig,
> {
  [prop: string]:
    | FieldInterpreterSpec<CFG, SourceField>
    | FieldInterpreterSpecBuilder<CFG, SourceField>
}

export interface ExtractionResult<O> {
  success: true
  result: O
}

export type Extractor<I, O> = (input: I) => ExtractionResult<O>

export const makeConcreteInterpretationSpec = <
  S extends Record<string, FieldInterpretationSpec<any, string>>,
  C extends Record<string, FieldInterpreter>,
>(
  def: S
): C => {
  return Object.entries(def).reduce((concrete, [key, fieldItp]) => {
    concrete[key] =
      FIELD_ITP_BUILDER in fieldItp
        ? (fieldItp as FieldInterpreterSpecBuilderInt<any, string>).build()
        : fieldItp

    return concrete
  }, {} as any) as C

  return {} as C
}

export const makeExtractor = <
  S extends Record<string, FieldInterpretationSpec<CFG, string>>,
  CFG extends InfopsyConfig = InfopsyConfig,
  I extends InputShape<S> = InputShape<S>,
  O extends OutputShape<S> = OutputShape<S>,
>(
  specDef: S
): Extractor<I, O> => {
  const spec = makeConcreteInterpretationSpec(specDef)
  return (input: I) => {
    const o = Object.entries(spec).reduce((result, [prop, itp]) => {
      const ir = itp.interpreter.process(input[itp.sourceProp as keyof I])
      result[prop] = ir.fact
      return result
    }, {} as any)

    return {
      success: true,
      result: o,
    } as ExtractionResult<O>
  }
}
