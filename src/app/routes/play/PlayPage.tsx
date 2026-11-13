import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { GameCanvas } from '@/features/game/components/organisms/GameCanvas'

export function PlayPage() {
  return (
    <section className="flex h-full flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-2xl font-medium">Scatter &amp; Catch</h1>
      <div className="h-80 w-full max-w-md overflow-hidden rounded-lg border border-border">
        <GameCanvas onHud={() => {}} onOver={() => {}} />
      </div>
      <Button asChild variant="outline">
        <Link to="/leaderboard">Leaderboard</Link>
      </Button>
    </section>
  )
}
