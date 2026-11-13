import { describe, expect, it } from 'vitest'

import { CONFIG } from '@/features/game/constants/config'
import { createGame, tap } from '@/features/game/lib/engine'
import type { Critter, GameState } from '@/features/game/types'

function makeCritter(overrides: Partial<Critter> = {}): Critter {
  return {
    id: 'c1',
    type: 'blob',
    x: 100,
    y: 100,
    vx: 0,
    vy: 0,
    radius: 10,
    alive: true,
    squash: 0,
    ...overrides,
  }
}

function playingGame(critters: Critter[]): GameState {
  const game = createGame(400, 400)
  game.screen = 'playing'
  game.critters = critters
  return game
}

describe('tap', () => {
  it('catches only the nearest of two overlapping critters', () => {
    const near = makeCritter({ id: 'near', x: 100, y: 100 })
    const far = makeCritter({ id: 'far', x: 108, y: 100 })
    const game = playingGame([far, near])

    const result = tap(game, 100, 100)

    expect(result?.critterId).toBe('near')
    expect(near.alive).toBe(false)
    expect(far.alive).toBe(true)
    expect(game.score).toBe(CONFIG.pointsPerCatch)
    expect(game.caught).toBe(1)
  })

  it('returns null for a tap just outside the catch padding', () => {
    const critter = makeCritter({ x: 100, y: 100, radius: 10 })
    const game = playingGame([critter])
    const maxDistance = critter.radius + CONFIG.catchRadiusPadding

    const result = tap(game, 100 + maxDistance + 1, 100)

    expect(result).toBeNull()
    expect(critter.alive).toBe(true)
    expect(game.score).toBe(0)
  })

  it('does nothing when the screen is not playing', () => {
    const critter = makeCritter({ x: 100, y: 100 })
    const game = playingGame([critter])
    game.screen = 'paused'

    const result = tap(game, 100, 100)

    expect(result).toBeNull()
    expect(critter.alive).toBe(true)
    expect(game.score).toBe(0)
  })
})
