import { describe, expect, it } from 'vitest'
import { extractPhoneNumber } from '@/phone'

describe('extractPhoneNumber', () => {
  describe('default opts', () => {
    it.each([
      [
        '070-444 19 19',
        [
          {
            kind: 'phone-number',
            fact: '070-444 19 19',
            start: 0,
            end: 13,
          },
        ],
      ],
      [
        'Tel: 070-444 19 19',
        [
          {
            kind: 'phone-number',
            fact: '070-444 19 19',
            start: 4,
            end: 17,
          },
        ],
      ],
    ])(
      'should extract a phone number with source reference from "%s"',
      (input, expected) => {
        expect(extractPhoneNumber(input)).toEqual(expected)
      }
    )
  })
})
