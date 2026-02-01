import { describe, expect, it } from 'vitest'
import {
  applyClaim,
  makeConcreteInterpretationSpec,
  makeInitialFieldAnalysisMap,
} from '@/extractor'
import { unclassified } from '@/unclassified'

describe('FieldAnalysis', () => {
  describe('makeInitialFieldAnalysisMap', () => {
    it('should create a full initial field analysis state', () => {
      // Given
      const input = { someField: 'This is the input', otherField: 'This too' }
      const spec = makeConcreteInterpretationSpec({
        field1: { sourceProp: 'someField', interpreter: unclassified() },
        field2: { sourceProp: 'otherField', interpreter: unclassified() },
      })

      // When
      const a = makeInitialFieldAnalysisMap(input, spec)

      // Then
      expect(a).toEqual({
        someField: {
          raw: 'This is the input',
          segments: [
            {
              start: 0,
              end: 17,
              content: 'This is the input',
              claim: [],
            },
          ],
          claims: [],
        },
        otherField: {
          raw: 'This too',
          segments: [
            {
              start: 0,
              end: 8,
              content: 'This too',
              claim: [],
            },
          ],
          claims: [],
        },
      })
    })
  })
})

describe('Segmentation', () => {
  it('applyClaim', () => {
    // Given
    const fa = {
      raw: 'This is the input',
      segments: [
        {
          start: 0,
          end: 17,
          content: 'This is the input',
          claim: [],
        },
      ],
      claims: [],
    }

    // When
    applyClaim(fa, {
      start: 5,
      end: 11,
      kind: 'arbitrary',
      fact: 'is the',
    })

    // Then
    expect(fa.segments).toEqual([
      {
        start: 0,
        end: 5,
        content: 'This ',
        claim: [],
      },
      {
        start: 5,
        end: 11,
        kind: 'arbitrary',
        content: 'is the',
      },
      {
        start: 11,
        end: 17,
        content: ' input',
        claim: [],
      },
    ])
  })
})
