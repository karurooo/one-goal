import { useTop10 } from '@/features/leaderboard/api/scores'
import { RankRow } from '@/features/leaderboard/components/atoms/RankRow'
import { supabase } from '@/lib/supabase'

function Message({ children }: { children: string }) {
  return (
    <p role="status" className="py-6 text-sm text-muted-foreground">
      {children}
    </p>
  )
}

export function LeaderboardTable() {
  const { data, isPending, isError, refetch } = useTop10()

  if (!supabase) {
    return <Message>Leaderboard is offline. Your game still works.</Message>
  }
  if (isPending) return <Message>Loading scores…</Message>
  if (isError) {
    return (
      <div className="py-6 text-sm">
        <p role="alert" className="text-muted-foreground">
          Couldn't load the leaderboard.
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-2 underline underline-offset-4"
        >
          Try again
        </button>
      </div>
    )
  }
  if (data.length === 0) return <Message>No scores yet. Be the first!</Message>

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border text-muted-foreground">
          <th scope="col" className="py-2 pr-4 text-left font-normal">
            #
          </th>
          <th scope="col" className="py-2 pr-4 text-left font-normal">
            Player
          </th>
          <th scope="col" className="py-2 text-right font-normal">
            Score
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <RankRow key={row.id} rank={i + 1} row={row} />
        ))}
      </tbody>
    </table>
  )
}
