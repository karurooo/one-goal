import { useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

import { useGameLoop } from '@/features/game/hooks/useGameLoop'
import type { HudValues, RoundStats } from '@/features/game/types'

type Pointer = { x: number; y: number } | null

/**
 * Props contract (owned by B). The canvas owns the per-frame loop via
 * useGameLoop and reports out through these callbacks only — it never
 * receives game state as props.
 */
export type GameCanvasProps = {
  onHud: (hud: HudValues) => void
  onOver: (stats: RoundStats) => void
}

type PlainCircle = { x: number; y: number; vx: number; vy: number; r: number }

function makePlainCircles(): PlainCircle[] {
  return [
    { x: 80, y: 80, vx: 60, vy: 40, r: 20 },
    { x: 160, y: 120, vx: -50, vy: 70, r: 16 },
    { x: 220, y: 60, vx: 40, vy: -55, r: 24 },
  ]
}

/**
 * Sprint 1 scope: DPR canvas, resize, rAF+dt loop, pointer tracking, and
 * plain bouncing circles to prove the loop out. Critter rendering wired to
 * A's engine lands in Sprint 2+.
 */
export function GameCanvas({ onHud, onOver }: GameCanvasProps) {
  void onHud
  void onOver

  const pointerRef = useRef<Pointer>(null)
  const circlesRef = useRef<PlainCircle[]>(makePlainCircles())

  const canvasRef = useGameLoop((ctx, dt) => {
    const { width, height } = ctx.canvas.getBoundingClientRect()

    for (const circle of circlesRef.current) {
      circle.x += circle.vx * dt
      circle.y += circle.vy * dt

      if (circle.x - circle.r < 0 || circle.x + circle.r > width) {
        circle.vx = -circle.vx
        circle.x = Math.min(Math.max(circle.x, circle.r), width - circle.r)
      }
      if (circle.y - circle.r < 0 || circle.y + circle.r > height) {
        circle.vy = -circle.vy
        circle.y = Math.min(Math.max(circle.y, circle.r), height - circle.r)
      }

      ctx.beginPath()
      ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2)
      ctx.fillStyle = '#c084fc'
      ctx.fill()
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
