import { Locale } from './infopsy'
import { Claim, FieldAnalysis, Interpreter, InterpreterResult } from './interpreter'

export type AffiliationInterpreterOpts = {
  locale?: Locale
}

/**
 * FIXME: This is a naive hard-coded swedish language set of
 * kinship identifiers.
 *
 * The format is TBD, but also needs to support other variants
 * than def/indef.
 */
const KINSHIP_FORMS = [
  { indef: 'dotter', def: 'dottern' },
  { indef: 'son', def: 'sonen' },
  { indef: 'syster', def: 'systern' },
  { indef: 'bror' },
  { indef: 'broder', def: 'brodern' },
  { indef: 'far' },
  { indef: 'fader', def: 'fadern' },
  { indef: 'mor' },
  { indef: 'moder', def: 'modern' },
]

interface Forms {
  indef?: string
  def?: string
}

type Keyword = Forms

type Keywords = Keyword[]

const extractWords = (str: string | undefined, keywords: Keywords): Claim[] => {
  if (!str) return []

  const lcase = str.toLowerCase()

  const words = []

  for (const kw of keywords) {
    for (const p of [kw.def, kw.indef].filter(Boolean)) {
      const start = lcase.indexOf(p!)
      if (start !== -1) {
        words.push({
          start,
          end: start + p!.length,
          fact: p,
        })
      }
    }
  }
  return words
}

export const affiliation = (opts: AffiliationInterpreterOpts = {}): Interpreter => {
  return {
    type: 'phone-number',
    process: (input: FieldAnalysis): InterpreterResult => {
      return input.segments.flatMap((s) => {
        const words = extractWords(s.content, KINSHIP_FORMS)
        return words.map((w) => ({
          start: s.start + w.start,
          end: s.start + w.end,
          fact: w.fact,
          kind: 'affiliation',
        }))
      })
    },
  }
}
