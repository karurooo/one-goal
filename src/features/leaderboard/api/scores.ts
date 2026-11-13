import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { ensureSession, supabase } from '@/lib/supabase'
import type { ScoreRow, SubmitScoreInput } from '@/features/leaderboard/types'

const TOP10_KEY = ['leaderboard', 'top10'] as const

export const OFFLINE_MESSAGE = 'Leaderboard is offline'

/** Calls the submit_score() RPC (security definer, one submission per 25s). */
export async function submitScore(input: SubmitScoreInput): Promise<ScoreRow> {
  if (!supabase) throw new Error(OFFLINE_MESSAGE)
  await ensureSession()
  const { data, error } = await supabase.rpc('submit_score', {
    nickname: input.nickname,
    score: input.score,
    caught: input.caught,
    best_combo: input.bestCombo,
  })
  // PostgREST errors are plain objects; rethrow as Error so callers get .message.
  if (error) throw new Error(error.message)
  return data as ScoreRow
}

/** Top 10 by score desc, created_at asc. */
export async function fetchTop10(): Promise<ScoreRow[]> {
  if (!supabase) throw new Error(OFFLINE_MESSAGE)
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .order('score', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(10)
  if (error) throw new Error(error.message)
  return data as ScoreRow[]
}

export function useTop10() {
  return useQuery({
    queryKey: TOP10_KEY,
    queryFn: fetchTop10,
  })
}

export function useSubmitScore() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: submitScore,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TOP10_KEY }),
  })
}
