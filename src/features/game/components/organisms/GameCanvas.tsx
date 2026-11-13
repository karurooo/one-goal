import { useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

import { CONFIG } from '@/features/game/constants/config'
import { useGameLoop } from '@/features/game/hooks/useGameLoop'
import { step } from '@/features/game/lib/critter'
import type {
  Critter,
  HudValues,
  Pointer,
  RoundStats,
} from '@/features/game/types'

/**
 * Props contract (owned by B). The canvas owns the per-frame loop via
 * useGameLoop and reports out through these callbacks only — it never
 * receives game state as props.
 */
export type GameCanvasProps = {
  onHud: (hud: HudValues) => void
  onOver: (stats: RoundStats) => void
}

function makeCritters(count: number): Critter[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `critter-${i}`,
    type: 'blob',
    x: 40 + ((i * 53) % 240),
    y: 40 + ((i * 37) % 160),
    vx: 0,
    vy: 0,
    radius: 18,
    alive: true,
    squash: 0,
  }))
}

/**
 * S1-8: tracks the pointer and advances each critter through
 * critter.step() (wander/flee/bounce) every frame, replacing the Sprint 1
 * placeholder circles. Tap-to-catch (tap()) lands in Sprint 2.
 */
export function GameCanvas({ onHud, onOver }: GameCanvasProps) {
  void onHud
  void onOver

  const pointerRef = useRef<Pointer>(null)
  const crittersRef = useRef<Critter[]>(makeCritters(CONFIG.minCritters))

  const canvasRef = useGameLoop((ctx, dt) => {
    const { width, height } = ctx.canvas.getBoundingClientRect()

    for (const critter of crittersRef.current) {
      step(critter, width, height, pointerRef.current, dt)

      const squashScaleX = 1 + critter.squash
      const squashScaleY = 1 - critter.squash * 0.6

      ctx.save()
      ctx.translate(critter.x, critter.y)
      ctx.scale(squashScaleX, squashScaleY)
      ctx.beginPath()
      ctx.arc(0, 0, critter.radius, 0, Math.PI * 2)
      ctx.fillStyle = '#c084fc'
      ctx.fill()
      ctx.restore()
    }
  })

  function trackPointer(event: ReactPointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    pointerRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  function clearPointer() {
    pointerRef.current = null
  }

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full touch-none"
      onPointerDown={trackPointer}
      onPointerMove={trackPointer}
      onPointerUp={clearPointer}
      onPointerLeave={clearPointer}
      onPointerCancel={clearPointer}
    />
  )
}
