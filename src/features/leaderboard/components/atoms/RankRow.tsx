import type { ScoreRow } from '@/features/leaderboard/types'

type RankRowProps = {
  rank: number
  row: ScoreRow
}

export function RankRow({ rank, row }: RankRowProps) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="py-2 pr-4 text-muted-foreground tabular-nums">{rank}</td>
      <td className="py-2 pr-4 text-left font-medium break-all">
        {row.nickname}
      </td>
      <td className="py-2 text-right tabular-nums">{row.score}</td>
    </tr>
  )
}
