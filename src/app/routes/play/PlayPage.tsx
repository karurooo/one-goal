import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function PlayPage() {
  return (
    <section className="flex h-full flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-2xl font-medium">Scatter &amp; Catch</h1>
      <p className="text-sm text-muted-foreground">
        Game canvas goes here (Sprint 1+).
      </p>
      <Button asChild variant="outline">
        <Link to="/leaderboard">Leaderboard</Link>
      </Button>
    </section>
  )
}
