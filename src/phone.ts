import { Interpreter } from './interpreter'

export interface PhoneNumberInterpreterOpts {
  inferAreaCode?: boolean
}

export const phoneNumber = (opts: PhoneNumberInterpreterOpts = {}): Interpreter => {
  return {
    type: 'phone-number',
    process: (input: any) => {
      return {
        fact: input,
      }
    },
  }
}
