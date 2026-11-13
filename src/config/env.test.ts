import { describe, expect, it } from 'vitest'
import { envSchema } from './env'

describe('envSchema', () => {
  it('treats missing and blank values as offline', () => {
    expect(envSchema.parse({})).toEqual({})
    expect(
      envSchema.parse({ VITE_SUPABASE_URL: '', VITE_SUPABASE_ANON_KEY: '' }),
    ).toEqual({
      VITE_SUPABASE_URL: undefined,
      VITE_SUPABASE_ANON_KEY: undefined,
    })
  })

  it('rejects a malformed URL', () => {
    expect(() => envSchema.parse({ VITE_SUPABASE_URL: 'not-a-url' })).toThrow()
  })
})
