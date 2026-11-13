import { z } from 'zod'

/** Mirrors the SQL check + submit_score() checks on the scores table. */
export const nicknameSchema = z
  .string()
  .trim()
  .min(3, 'Nickname must be at least 3 characters')
  .max(16, 'Nickname must be at most 16 characters')

export const nicknameFormSchema = z.object({
  nickname: nicknameSchema,
})

export type NicknameFormValues = z.infer<typeof nicknameFormSchema>
