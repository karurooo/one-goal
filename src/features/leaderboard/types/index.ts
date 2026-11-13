export type ScoreRow = {
  id: string
  user_id: string
  nickname: string
  score: number
  caught: number
  best_combo: number
  created_at: string
  updated_at: string
}

export type SubmitScoreInput = {
  nickname: string
  score: number
  caught: number
  bestCombo: number
}
