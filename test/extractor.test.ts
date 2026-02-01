import { describe, it, expect } from 'vitest'
import { makeConcreteInterpretationSpec } from '@/extractor'
import { fieldInterpreterSpec } from '@/field'
import { InfopsyConfig } from './infopsy'

describe('makeConcreteInterpretationSpec', () => {
  it('should materialize spec from builder-only entries', () => {
    const config = {
      locale: 'sv-SE',
      interpreters: {},
    } satisfies InfopsyConfig

    expect(
      makeConcreteInterpretationSpec({
        fullName: fieldInterpreterSpec(config, 'name'),
        age: fieldInterpreterSpec(config, 'age'),
      })
    ).toEqual({
      fullName: {
        sourceProp: 'name',
        interpreter: expect.objectContaining({
          type: 'retain',
        }),
      },
      age: {
        sourceProp: 'age',
        interpreter: expect.objectContaining({
          type: 'retain',
        }),
      },
    })
  })
})
