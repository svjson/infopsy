export const FIELD_ITP_BUILDER: unique symbol = Symbol('FieldInterpreterSpecBuilder')

export interface FieldInterpreterSpecBuilder<SourceField extends string> {
  readonly [FIELD_ITP_BUILDER]: true
  use: (interpreter: string) => FieldInterpreterSpecBuilder<SourceField>
}

export type FieldInterpreterSpecBuilderInt<SourceField extends string> =
  FieldInterpreterSpecBuilder<SourceField> & {
    build: () => FieldInterpreterSpec<SourceField>
  }

export type FieldInterpreterSpec<SourceField extends string> = {
  sourceProp: SourceField
  interpreter?: string
}

export type FieldInterpretationSpec<SourceField extends string> =
  | FieldInterpreterSpec<SourceField>
  | FieldInterpreterSpecBuilder<SourceField>

export type FieldInterpreter = {
  sourceProp?: string
}

export const fieldInterpreterSpec = <SF extends string>(
  sourceProp: SF
): FieldInterpreterSpecBuilder<SF> => {
  const opts: FieldInterpreterSpec<SF> = {
    sourceProp,
  }

  return {
    [FIELD_ITP_BUILDER]: true,
    use(interpreter: string) {
      opts.interpreter = interpreter
      return this
    },
    build(): FieldInterpreterSpec<SF> {
      return opts
    },
  } as FieldInterpreterSpecBuilder<SF>
}
