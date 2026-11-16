import { describe, expect, it } from 'vitest'
import raw from './office.json'
import { officeContentSchema } from './schema'

function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(strings)
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings)
  return []
}

describe('office content', () => {
  it('TC-CONT-01: office.json parses with officeContentSchema', () => {
    expect(() => officeContentSchema.parse(raw)).not.toThrow()
  })

  it('TC-CONT-02: contains no Philippine mobile numbers', () => {
    const mobile = /(09\d{9}|\+639\d{9})/
    expect(strings(raw).filter((s) => mobile.test(s.replace(/[\s-]/g, '')))).toEqual([])
  })

  it('rejects a stat that is neither a number nor the placeholder', () => {
    const stats = raw.about.stats.map((s) => ({ ...s, value: 'lots' }))
    const bad = { ...raw, about: { ...raw.about, stats } }
    expect(officeContentSchema.safeParse(bad).success).toBe(false)
  })
})
