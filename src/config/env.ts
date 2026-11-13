import { z } from 'zod'

// Blank values (e.g. a copied .env.example) count as missing, so the app falls back to offline mode.
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (v === '' ? undefined : v), schema.optional())

export const envSchema = z.object({
  VITE_SUPABASE_URL: optional(z.url()),
  VITE_SUPABASE_ANON_KEY: optional(z.string()),
})

export const env = envSchema.parse(import.meta.env)
