import { describe, it, expect } from 'vitest'
import { makeConcreteInterpretationSpec } from '@/extractor'
import { fieldInterpreterSpec } from '@/field'

describe('makeConcreteInterpretationSpec', () => {
  it('should materialize spec from builder-only entries', () => {
    expect(
      makeConcreteInterpretationSpec({
        fullName: fieldInterpreterSpec('name'),
        age: fieldInterpreterSpec('age'),
      })
    ).toEqual({
      fullName: { sourceProp: 'name' },
      age: { sourceProp: 'age' },
    })
  })
})
