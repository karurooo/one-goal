import { createClient } from '@supabase/supabase-js'
import { env } from '@/config/env'

const { VITE_SUPABASE_URL: url, VITE_SUPABASE_ANON_KEY: key } = env

/** Null when env is missing: the game still plays and the leaderboard shows offline. */
export const supabase = url && key ? createClient(url, key) : null

/** Signs in anonymously once; later calls reuse the persisted session. */
export async function ensureSession() {
  if (!supabase) throw new Error('Supabase is not configured')
  const { data } = await supabase.auth.getSession()
  if (data.session) return data.session
  const { data: signIn, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  return signIn.session
}
