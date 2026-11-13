import type { GameState } from '@/features/game/types'

/** Reads GameState but never mutates it (B <-> A boundary). */
export function draw(game: GameState, ctx: CanvasRenderingContext2D): void {
  void game
  void ctx
  throw new Error('not implemented')
}
