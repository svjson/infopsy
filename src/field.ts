import { InfopsyConfig } from './infopsy'
import { Interpreter } from './interpreter'
import { RETAIN } from './retain'

export const FIELD_ITP_BUILDER: unique symbol = Symbol('FieldInterpreterSpecBuilder')

export interface FieldInterpreterSpecBuilder<
  CFG extends InfopsyConfig,
  SourceField extends string,
> {
  readonly [FIELD_ITP_BUILDER]: true
  use: (
    interpreter: keyof CFG['interpreters']
  ) => FieldInterpreterSpecBuilder<CFG, SourceField>
}

export type FieldInterpreterSpecBuilderInt<
  CFG extends InfopsyConfig,
  SourceField extends string,
> = FieldInterpreterSpecBuilder<CFG, SourceField> & {
  build: () => FieldInterpreterSpec<CFG, SourceField>
}

export type FieldInterpreterSpec<
  CFG extends InfopsyConfig,
  SourceField extends string,
> = {
  sourceProp: SourceField
  interpreter?: keyof CFG['interpreters']
}

export type FieldInterpretationSpec<
  CFG extends InfopsyConfig,
  SourceField extends string,
> =
  | FieldInterpreterSpec<CFG, SourceField>
  | FieldInterpreterSpecBuilder<CFG, SourceField>
  | FieldInterpreter

export type FieldInterpreter = {
  sourceProp?: string
  interpreter: Interpreter
}

export const fieldInterpreterSpec = <CFG extends InfopsyConfig, SF extends string>(
  config: CFG,
  sourceProp: SF
): FieldInterpreterSpecBuilder<CFG, SF> => {
  const opts: FieldInterpreter /*<CFG, SF>*/ = {
    sourceProp,
    interpreter: RETAIN,
  }

  return {
    [FIELD_ITP_BUILDER]: true,
    use(interpreter: keyof CFG['interpreters']) {
      opts.interpreter = (config.interpreters as CFG['interpreters'])[interpreter]
      return this
    },
    build(): FieldInterpreter /* <CFG, SF> */ {
      return opts
    },
  } as FieldInterpreterSpecBuilder<CFG, SF>
}
