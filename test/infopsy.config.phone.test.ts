import { describe, it, expect } from 'vitest'

import infopsy, { phoneNumber, unclassified, bool, affiliation } from '@/index'

describe('Basic Usage', () => {
  describe('Phone Number input containing comments, noise and affiliation annotations', () => {
    const fx = infopsy({
      locale: 'sv-SE',

      interpreters: {
        phone: phoneNumber(),
        comment: unclassified(),
        bool: bool(),
        relation: affiliation(),
      },
    })

    const extract = fx.extractor({
      phoneNumber: fx.from('pd_phone').use('phone'),
      isPrimary: fx.from('main').use('bool'),
      affiliation: fx.from('pd_phone').use('relation'),
      comment: fx.from('pd_phone').use('comment'),
    })

    it.each([
      {
        case: 'trailing comment',
        input: {
          pd_phone: '070-112 28 45 Work',
          main: 1,
        },
        expected: {
          success: true,
          result: {
            phoneNumber: '070-112 28 45',
            isPrimary: true,
            comment: 'Work',
            affiliation: undefined,
          },
        },
      },
      {
        case: 'trailing relationship comment',
        input: {
          pd_phone: '0704443322 Bror',
          main: 0,
        },
        expected: {
          success: true,
          result: {
            phoneNumber: '0704443322',
            isPrimary: false,
            comment: undefined,
            affiliation: 'bror',
          },
        },
      },
    ])('should parse input with $case', ({ input, expected }) => {
      expect(extract(input)).toEqual(expected)
    })
  })
})
