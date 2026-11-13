import { CONFIG } from '@/features/game/constants/config'
import type { Critter, GameState, TapEvent } from '@/features/game/types'

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

function spawnCritters(
  count: number,
  width: number,
  height: number,
): Critter[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `critter-${Date.now()}-${i}`,
    type: 'blob',
    x: Math.random() * width,
    y: Math.random() * height,
    vx: 0,
    vy: 0,
    radius: 18,
    alive: true,
    squash: 0,
  }))
}

/** Resets score/caught/combo/critters and starts the 30s round. */
export function startRound(game: GameState): void {
  game.critters = spawnCritters(CONFIG.minCritters, game.width, game.height)
  game.particles = []
  game.score = 0
  game.caught = 0
  game.combo = 0
  game.lastCatchAt = 0
  game.timeRemaining = CONFIG.roundSeconds
  game.screen = 'playing'
}

/** Flee behavior: critters move away from the pointer. */
export function attract(game: GameState): void {
  void game
  throw new Error('not implemented')
}

/** Counts the round timer down while playing; ends the round at 0. */
export function update(game: GameState, dt: number): void {
  if (game.screen !== 'playing') return

  game.timeRemaining = Math.max(0, game.timeRemaining - dt)
  if (game.timeRemaining <= 0) {
    game.timeRemaining = 0
    game.screen = 'over'
  }
}

/** Nearest-first single catch within radius + CONFIG.catchRadiusPadding. */
export function tap(game: GameState, x: number, y: number): TapEvent | null {
  if (game.screen !== 'playing') return null

  let nearest: Critter | null = null
  let nearestDistance = Infinity

  for (const critter of game.critters) {
    if (!critter.alive) continue

    const dx = critter.x - x
    const dy = critter.y - y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const maxDistance = critter.radius + CONFIG.catchRadiusPadding

    if (distance <= maxDistance && distance < nearestDistance) {
      nearest = critter
      nearestDistance = distance
    }
  }

  if (!nearest) return null

  nearest.alive = false
  game.score += CONFIG.pointsPerCatch
  game.caught += 1

  return {
    critterId: nearest.id,
    type: nearest.type,
    points: CONFIG.pointsPerCatch,
  }
}
