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
import { Claim, FieldAnalysis, Segment } from './interpreter'

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
}

export const applyClaim = (fa: FieldAnalysis, claim: Claim) => {
  fa.segments = fa.segments.flatMap((seg) => {
    if (claim.start >= seg.start && claim.end <= seg.end) {
      return [
        claim.start > seg.start
          ? {
              ...seg,
              start: seg.start,
              end: claim.start,
              content: seg.content?.slice(seg.start, claim.start),
            }
          : undefined,
        {
          start: claim.start,
          end: claim.end,
          kind: claim.kind,
          content: claim.fact,
        },
        claim.end < seg.end
          ? {
              ...seg,
              start: claim.end,
              end: seg.end,
              content: seg.content?.slice(claim.end, seg.end),
            }
          : undefined,
      ].filter(Boolean) as Segment[]
    }
    return [seg]
  })
  fa.claims.push(claim)
  fa.claims.sort((a, b) => b.start - a.end)
}

export const makeInitialFieldAnalysisMap = <I extends Record<string, any>>(
  input: I,
  spec: Record<string, FieldInterpreter>
) => {
  return Object.values(spec).reduce(
    (initial, itp) => {
      const fi = input[itp.sourceProp as keyof I]
      const raw = typeof fi === 'undefined' ? undefined : String(fi)
      initial[itp.sourceProp as keyof I] = {
        raw: fi,
        segments: [
          {
            start: typeof raw === 'string' ? 0 : -1,
            end: typeof raw === 'string' ? raw.length : -1,
            content: raw,
            claim: [],
          },
        ],
        claims: [],
      } satisfies FieldAnalysis
      return initial
    },
    {} as Record<keyof I, FieldAnalysis>
  )
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
    const analysis = makeInitialFieldAnalysisMap(input, spec)
    const o = Object.entries(spec).reduce((result, [prop, itp]) => {
      const inputKey = itp.sourceProp as keyof I
      const fa = analysis[inputKey]
      const claims = itp.interpreter.process(fa)
      claims.forEach((claim) => {
        applyClaim(fa, claim)
        result[prop] = claim.fact
      })

      return result
    }, {} as any)

    return {
      success: true,
      result: o,
    } as ExtractionResult<O>
  }
}
