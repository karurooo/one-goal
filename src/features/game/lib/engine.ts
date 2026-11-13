import { CONFIG } from '@/features/game/constants/config'
import { step } from '@/features/game/lib/critter'
import type {
  Critter,
  GameState,
  Pointer,
  TapEvent,
} from '@/features/game/types'

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
    pointer: null,
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
    radius: CONFIG.critterRadius,
    alive: true,
    squash: 0,
  }))
}

type Edge = 'left' | 'right' | 'top' | 'bottom'

/** The wall whose line is farthest from the pointer (defaults to 'top'). */
function farthestEdge(pointer: Pointer, width: number, height: number): Edge {
  if (!pointer) return 'top'

  const distances: Record<Edge, number> = {
    left: pointer.x,
    right: width - pointer.x,
    top: pointer.y,
    bottom: height - pointer.y,
  }

  return (Object.keys(distances) as Edge[]).reduce((best, edge) =>
    distances[edge] > distances[best] ? edge : best,
  )
}

function positionOnEdge(
  edge: Edge,
  width: number,
  height: number,
  radius: number,
): { x: number; y: number } {
  switch (edge) {
    case 'left':
      return { x: radius, y: Math.random() * height }
    case 'right':
      return { x: width - radius, y: Math.random() * height }
    case 'top':
      return { x: Math.random() * width, y: radius }
    case 'bottom':
      return { x: Math.random() * width, y: height - radius }
  }
}

/** Spawns `count` critters along the wall farthest from the pointer. */
function spawnAtFarEdge(game: GameState, count: number): Critter[] {
  const edge = farthestEdge(game.pointer, game.width, game.height)
  const radius = CONFIG.critterRadius

  return Array.from({ length: count }, (_, i) => {
    const { x, y } = positionOnEdge(edge, game.width, game.height, radius)
    return {
      id: `critter-${Date.now()}-respawn-${i}`,
      type: 'blob',
      x,
      y,
      vx: 0,
      vy: 0,
      radius,
      alive: true,
      squash: 0,
    }
  })
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

/**
 * Counts the round timer down while playing, ends the round at 0,
 * advances every critter through critter.step(), prunes dead ones, and
 * tops up to 5 fresh critters (far from the pointer) whenever fewer than
 * CONFIG.minCritters remain alive.
 */
export function update(game: GameState, dt: number): void {
  if (game.screen !== 'playing') return

  game.timeRemaining = Math.max(0, game.timeRemaining - dt)
  if (game.timeRemaining <= 0) {
    game.timeRemaining = 0
    game.screen = 'over'
    return
  }

  game.critters = game.critters.filter((critter) => critter.alive)

  for (const critter of game.critters) {
    step(critter, game.width, game.height, game.pointer, dt)
  }

  if (game.critters.length < CONFIG.minCritters) {
    game.critters.push(...spawnAtFarEdge(game, 5))
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
