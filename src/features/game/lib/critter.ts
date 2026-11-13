import { CONFIG } from '@/features/game/constants/config'
import type { Critter, Pointer } from '@/features/game/types'

function length(x: number, y: number): number {
  return Math.sqrt(x * x + y * y)
}

function wander(critter: Critter): void {
  const speed = length(critter.vx, critter.vy)
  if (speed === 0) {
    const angle = Math.random() * Math.PI * 2
    critter.vx = Math.cos(angle) * CONFIG.movement.wanderSpeed
    critter.vy = Math.sin(angle) * CONFIG.movement.wanderSpeed
    return
  }
  critter.vx = (critter.vx / speed) * CONFIG.movement.wanderSpeed
  critter.vy = (critter.vy / speed) * CONFIG.movement.wanderSpeed
}

/** Moves away from the pointer along the normalized away vector. */
function flee(critter: Critter, pointer: { x: number; y: number }): void {
  const dx = critter.x - pointer.x
  const dy = critter.y - pointer.y
  const distance = length(dx, dy)
  if (distance === 0) return
  critter.vx = (dx / distance) * CONFIG.movement.fleeSpeed
  critter.vy = (dy / distance) * CONFIG.movement.fleeSpeed
}

/** Clamps position to bounds, reflects velocity, and squashes on impact. */
function bounce(critter: Critter, width: number, height: number): void {
  let bounced = false

  if (critter.x - critter.radius < 0) {
    critter.x = critter.radius
    critter.vx = Math.abs(critter.vx)
    bounced = true
  } else if (critter.x + critter.radius > width) {
    critter.x = width - critter.radius
    critter.vx = -Math.abs(critter.vx)
    bounced = true
  }

  if (critter.y - critter.radius < 0) {
    critter.y = critter.radius
    critter.vy = Math.abs(critter.vy)
    bounced = true
  } else if (critter.y + critter.radius > height) {
    critter.y = height - critter.radius
    critter.vy = -Math.abs(critter.vy)
    bounced = true
  }

  if (bounced) critter.squash = CONFIG.movement.squashAmount
}

/**
 * Advances one critter by `dt` seconds: flees the pointer within
 * CONFIG.movement.fleeRadius, otherwise wanders; bounces off walls with
 * squash; decays squash back to 0.
 */
export function step(
  critter: Critter,
  width: number,
  height: number,
  pointer: Pointer,
  dt: number,
): void {
  if (!critter.alive) return

  const distanceToPointer = pointer
    ? length(critter.x - pointer.x, critter.y - pointer.y)
    : Infinity

  if (
    pointer &&
    distanceToPointer > 0 &&
    distanceToPointer < CONFIG.movement.fleeRadius
  ) {
    flee(critter, pointer)
  } else {
    wander(critter)
  }

  critter.x += critter.vx * dt
  critter.y += critter.vy * dt

  bounce(critter, width, height)

  critter.squash = Math.max(
    0,
    critter.squash - CONFIG.movement.squashDecayPerSecond * dt,
  )
}
