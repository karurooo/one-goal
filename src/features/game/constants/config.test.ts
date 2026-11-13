import { describe, expect, it } from 'vitest'

import { MAX_SCORE } from '@/features/game/constants/config'

describe('MAX_SCORE', () => {
  // Fails when a scoring number in CONFIG changes: update submit_score() (S3-7) too.
  it('matches the ceiling hard-coded in the SQL', () => {
    expect(MAX_SCORE).toBe(10800)
  })
})
