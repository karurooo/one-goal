import type { HudValues, RoundStats } from '@/features/game/types'

/**
 * Props contract (owned by B). The canvas owns the per-frame loop via
 * useGameLoop and reports out through these callbacks only — it never
 * receives game state as props.
 */
export type GameCanvasProps = {
  onHud: (hud: HudValues) => void
  onOver: (stats: RoundStats) => void
}

export function GameCanvas(props: GameCanvasProps) {
  void props
  return <canvas className="h-full w-full" />
}
