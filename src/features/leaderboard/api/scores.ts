import { useMutation, useQuery } from '@tanstack/react-query'

import type { ScoreRow, SubmitScoreInput } from '@/features/leaderboard/types'

/** Calls the submit_score() RPC (security definer, one submission per 25s). */
export async function submitScore(input: SubmitScoreInput): Promise<ScoreRow> {
  void input
  throw new Error('not implemented')
}

/** Top 10 by score desc, created_at asc. */
export async function fetchTop10(): Promise<ScoreRow[]> {
  throw new Error('not implemented')
}

export function useTop10() {
  return useQuery({
    queryKey: ['leaderboard', 'top10'],
    queryFn: fetchTop10,
  })
}

export function useSubmitScore() {
  return useMutation({
    mutationFn: submitScore,
  })
}
