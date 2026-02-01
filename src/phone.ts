import { Claim, FieldAnalysis, Interpreter, InterpreterResult } from './interpreter'

/**
 * Regex that encloses any reasonable(and a few unreasonable) phone number formats
 * in a group. This allows leading and trailing noise, as well as some non-standard
 * symbols and frequently occuring typos.
 */
const PHONE_NUMBER_REGEX =
  /\s*((?:\+?\d{1,4}[\s\-.*()#´]?)?(?:\(?\d{2,4}\)?[\s\-.*()]?)?\d[\d\s\-.*()]*\d)\s*/

export interface PhoneNumberInterpreterOpts {
  inferAreaCode?: boolean
}

export const extractPhoneNumber = (input?: string): Claim[] => {
  if (!input) return []
  const match = input.match(PHONE_NUMBER_REGEX)
  if (match && match[1] && match[1].length > 5 && typeof match.index === 'number') {
    const cleaned = match[1].replaceAll(/\s/g, ' ').replaceAll(/[´.]/g, '-')
    return [
      {
        fact: cleaned,
        start: match.index,
        end: match.index! + match[1].length,
        kind: 'phone-number',
      },
    ]
  }
  return []
}

export const phoneNumber = (opts: PhoneNumberInterpreterOpts = {}): Interpreter => {
  return {
    type: 'phone-number',
    process: (input: FieldAnalysis): InterpreterResult => {
      return extractPhoneNumber(input.raw)
    },
  }
}
