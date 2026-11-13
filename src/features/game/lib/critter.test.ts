import { describe, expect, it } from 'vitest'

import { step } from '@/features/game/lib/critter'
import type { Critter } from '@/features/game/types'

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

describe('critter.step', () => {
  it('flees away from the pointer when within flee radius', () => {
    const critter = makeCritter({ x: 100, y: 100 })
    const pointer = { x: 50, y: 100 } // pointer to the left

    step(critter, 400, 400, pointer, 1 / 60)

    // critter should move away, i.e. to the right (+x)
    expect(critter.vx).toBeGreaterThan(0)
    expect(critter.x).toBeGreaterThan(100)
  })

  it('wanders instead of fleeing when the pointer is outside flee radius', () => {
    const critter = makeCritter({ x: 100, y: 100, vx: 5, vy: 0 })
    const farPointer = { x: 100, y: 100 - 1000 }

    step(critter, 2000, 2000, farPointer, 1 / 60)

    const speed = Math.hypot(critter.vx, critter.vy)
    expect(speed).toBeCloseTo(40, 0) // CONFIG.movement.wanderSpeed
  })

  it('bounces off the right wall, reverses vx, and squashes', () => {
    const critter = makeCritter({
      x: 195,
      y: 100,
      vx: 50,
      vy: 0,
      radius: 10,
    })

    step(critter, 200, 200, null, 1 / 60)

    expect(critter.vx).toBeLessThan(0)
    expect(critter.x).toBeLessThanOrEqual(190)
    expect(critter.squash).toBeGreaterThan(0)
  })

  it('bounces off the left wall and reverses vx', () => {
    const critter = makeCritter({
      x: 5,
      y: 100,
      vx: -50,
      vy: 0,
      radius: 10,
    })

    step(critter, 200, 200, null, 1 / 60)

    expect(critter.vx).toBeGreaterThan(0)
    expect(critter.x).toBeGreaterThanOrEqual(10)
  })

  it('decays squash back toward zero over time', () => {
    const critter = makeCritter({ squash: 1, x: 100, y: 100 })

    step(critter, 400, 400, null, 1 / 60)

    expect(critter.squash).toBeLessThan(1)
    expect(critter.squash).toBeGreaterThan(0)
  })

  it('does not move a dead critter', () => {
    const critter = makeCritter({ alive: false, x: 100, y: 100 })

    step(critter, 400, 400, null, 1 / 60)

    expect(critter.x).toBe(100)
    expect(critter.y).toBe(100)
  })
})
