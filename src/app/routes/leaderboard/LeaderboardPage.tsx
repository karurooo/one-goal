import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function LeaderboardPage() {
  return (
    <section className="flex h-full flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-2xl font-medium">Top 10</h1>
      <p className="text-sm text-muted-foreground">
        Leaderboard table goes here (Sprint 4).
      </p>
      <Button asChild variant="outline">
        <Link to="/">Play</Link>
      </Button>
    </section>
  )
}
