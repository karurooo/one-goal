import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LeaderboardTable } from '@/features/leaderboard'

export function LeaderboardPage() {
  return (
    <section className="flex h-full flex-col items-center justify-center gap-6 p-4 text-center sm:p-6">
      <h1 className="text-2xl font-medium">Top 10</h1>
      <Card className="w-full max-w-md p-4 sm:p-6">
        <LeaderboardTable />
      </Card>
      <Button asChild variant="outline">
        <Link to="/">Back to Play</Link>
      </Button>
    </section>
  )
}
