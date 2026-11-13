import type { GameState, TapEvent } from '@/features/game/types'

/**
 * Engine API contract (owned by A). Signatures are locked for Sprint 1+;
 * bodies are stubs until A implements movement/scoring/phases.
 */

export function createGame(width: number, height: number): GameState {
  return {
    width,
    height,
    screen: 'start',
    critters: [],
    particles: [],
    timeRemaining: 0,
    score: 0,
    caught: 0,
    combo: 0,
    bestCombo: 0,
    lastCatchAt: 0,
  }
}

export function startRound(game: GameState): void {
  void game
  throw new Error('not implemented')
}

/** Flee behavior: critters move away from the pointer. */
export function attract(game: GameState): void {
  void game
  throw new Error('not implemented')
}

/** Advances the simulation by `dt` seconds. */
export function update(game: GameState, dt: number): void {
  void game
  void dt
  throw new Error('not implemented')
}

/** Nearest-first single catch within radius + CONFIG.catchRadiusPadding. */
export function tap(game: GameState, x: number, y: number): TapEvent | null {
  void game
  void x
  void y
  throw new Error('not implemented')
}
