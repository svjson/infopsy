import { InfopsyConfig } from './infopsy'

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
> = FieldInterpreterSpec<CFG, SourceField> | FieldInterpreterSpecBuilder<CFG, SourceField>

export type FieldInterpreter = {
  sourceProp?: string
}

export const fieldInterpreterSpec = <CFG extends InfopsyConfig, SF extends string>(
  sourceProp: SF
): FieldInterpreterSpecBuilder<CFG, SF> => {
  const opts: FieldInterpreterSpec<CFG, SF> = {
    sourceProp,
  }

  return {
    [FIELD_ITP_BUILDER]: true,
    use(interpreter: keyof CFG['interpreters']) {
      opts.interpreter = interpreter
      return this
    },
    build(): FieldInterpreterSpec<CFG, SF> {
      return opts
    },
  } as FieldInterpreterSpecBuilder<CFG, SF>
}
