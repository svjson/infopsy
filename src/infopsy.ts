import { Interpreter } from './interpreter'
import {
  FieldInterpretationSpec,
  fieldInterpreterSpec,
  FieldInterpreterSpecBuilder,
} from './field'
import { Extractor, makeExtractor } from './extractor'
import { InputShape, OutputShape } from './infer'

type Locale = 'sv-SE'

export type Infopsy = {
  /**
   * Creates a content extractor function acording to the specification `spec`.
   */
  extractor: <
    S extends Record<string, FieldInterpretationSpec<string>>,
    I extends InputShape<S> = InputShape<S>,
    O extends OutputShape<S> = OutputShape<S>,
  >(
    spec: S
  ) => Extractor<I, O>

  /**
   * Begins a builder for defining extraction of a single fact.
   *
   * @param sourceProp The source property from which to extract the fact.
   *
   * @returns A builder for defining the field interpretation specification.
   */
  from: <SF extends string>(sourceProp: SF) => FieldInterpreterSpecBuilder<SF>
}

export type InterpreterMap = Record<string, Interpreter>

/**
 * Configuration options for an infopsy instance.
 */
export interface InfopsyConfig {
  locale?: Locale

  interpreters?: InterpreterMap
}

/**
 * Main factory/entry point for creating an infopsy content extraction
 * object.
 *
 * @param config Configuration options for infopsy instance.
 *
 * @returns An object with methods for creating extractors and field interpreter specs.
 */
export const infopsy = (config: InfopsyConfig = {}): Infopsy => {
  return {
    extractor<
      S extends Record<string, FieldInterpretationSpec<string>>,
      I extends InputShape<S> = InputShape<S>,
      O extends OutputShape<S> = OutputShape<S>,
    >(spec: S): Extractor<I, O> {
      return makeExtractor(spec)
    },
    from<SF extends string>(sourceProp: SF): FieldInterpreterSpecBuilder<SF> {
      return fieldInterpreterSpec(sourceProp)
    },
  }
}
