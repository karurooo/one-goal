import { useEffect, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

import { useGameLoop } from '@/features/game/hooks/useGameLoop'
import { createGame, startRound, tap, update } from '@/features/game/lib/engine'
import type { GameState, HudValues, RoundStats } from '@/features/game/types'

/**
 * Props contract (owned by B). The canvas owns the per-frame loop via
 * useGameLoop and reports out through these callbacks only — it never
 * receives game state as props.
 */
export type GameCanvasProps = {
  onHud: (hud: HudValues) => void
  onOver: (stats: RoundStats) => void
}

const HUD_PUSH_INTERVAL_SECONDS = 1 / 10 // ~10 Hz, per S2-5

/**
 * Owns the engine's GameState end to end: starts a round on mount,
 * advances it every frame via update() (movement, timer, respawn), and
 * resolves taps via tap(). Pushes HUD snapshots at ~10 Hz and reports
 * onOver once when the round ends.
 */
export function GameCanvas({ onHud, onOver }: GameCanvasProps) {
  const gameRef = useRef<GameState | null>(null)
  const hudAccumulatorRef = useRef(0)
  const roundEndedRef = useRef(false)
  const touchLingerTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (touchLingerTimeoutRef.current !== null) {
        clearTimeout(touchLingerTimeoutRef.current)
      }
    }
  }, [])

  const canvasRef = useGameLoop((ctx, dt) => {
    const { width, height } = ctx.canvas.getBoundingClientRect()

    let game = gameRef.current
    if (!game) {
      game = createGame(width, height)
      startRound(game)
      gameRef.current = game
    } else {
      game.width = width
      game.height = height
    }

    update(game, dt)

    for (const critter of game.critters) {
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

    hudAccumulatorRef.current += dt
    if (hudAccumulatorRef.current >= HUD_PUSH_INTERVAL_SECONDS) {
      hudAccumulatorRef.current = 0
      onHud({
        score: game.score,
        timeRemaining: game.timeRemaining,
        combo: game.combo,
      })
    }

    if (game.screen === 'over' && !roundEndedRef.current) {
      roundEndedRef.current = true
      onOver({
        score: game.score,
        caught: game.caught,
        bestCombo: game.bestCombo,
      })
    }
  })

  function pointerPosition(event: ReactPointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  function clearTouchLinger() {
    if (touchLingerTimeoutRef.current !== null) {
      clearTimeout(touchLingerTimeoutRef.current)
      touchLingerTimeoutRef.current = null
    }
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    const game = gameRef.current
    if (!game) return

    clearTouchLinger()
    const position = pointerPosition(event)
    game.pointer = position
    tap(game, position.x, position.y)
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    const game = gameRef.current
    if (game) game.pointer = pointerPosition(event)
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLCanvasElement>) {
    const game = gameRef.current
    if (!game) return

    if (event.pointerType === 'touch') {
      clearTouchLinger()
      touchLingerTimeoutRef.current = window.setTimeout(() => {
        game.pointer = null
        touchLingerTimeoutRef.current = null
      }, 500)
      return
    }

    game.pointer = null
  }

  function clearPointerImmediately() {
    clearTouchLinger()
    const game = gameRef.current
    if (game) game.pointer = null
  }

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={clearPointerImmediately}
      onPointerCancel={clearPointerImmediately}
    />
  )
}
