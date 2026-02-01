import { describe, it, expect } from 'vitest'

import infopsy, { phoneNumber, unclassified } from '@/index'

describe('Basic Usage', () => {
  it('should construct a valid extractor function through basic usage', () => {
    const fx = infopsy({
      locale: 'sv-SE',

      interpreters: {
        phone: phoneNumber(),
        comment: unclassified(),
      },
    })

    const extract = fx.extractor({
      phoneNumber: fx.from('pd_phone').use('phone'),
      comment: fx.from('pd_phone').use('comment'),
    })

    const result = extract({
      pd_phone: '070-112 28 45',
    })

    expect(result).toEqual({
      success: true,
      result: {
        phoneNumber: '070-112 28 45',
        comment: '070-112 28 45',
      },
    })
  })
})
