import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { GameCanvas, useGameStore } from '@/features/game'

export function PlayPage() {
  const screen = useGameStore((state) => state.screen)
  const start = useGameStore((state) => state.start)
  const setHud = useGameStore((state) => state.setHud)
  const over = useGameStore((state) => state.over)

  return (
    <main className="relative h-full w-full overflow-hidden">
      <GameCanvas onHud={setHud} onOver={over} />

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-lg font-medium">{screen}</p>
        <div className="pointer-events-auto flex items-center gap-3">
          <Button onClick={start}>Play</Button>
          <Button asChild variant="outline">
            <Link to="/leaderboard">Leaderboard</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
