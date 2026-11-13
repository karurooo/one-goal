export type GameScreen = 'start' | 'playing' | 'paused' | 'over'

export type CritterType = 'blob' | 'spiky' | 'bomb'

export type Critter = {
  id: string
  type: CritterType
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alive: boolean
  /** 0 = normal, >0 = squashed from a recent wall bounce; decays to 0. */
  squash: number
}

export type Pointer = { x: number; y: number } | null

export type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
}

/**
 * Per-frame simulation state. Lives in a useRef inside useGameLoop — never
 * in Zustand or React state (see docs/Scatter & Catch Team Plan.md).
 */
export type GameState = {
  width: number
  height: number
  screen: GameScreen
  critters: Critter[]
  particles: Particle[]
  timeRemaining: number
  score: number
  caught: number
  combo: number
  bestCombo: number
  lastCatchAt: number
}

export type RoundStats = {
  score: number
  caught: number
  bestCombo: number
}

/** Throttled (~10 Hz) snapshot pushed from the game loop into gameStore. */
export type HudValues = {
  score: number
  timeRemaining: number
  combo: number
}

export type TapEvent = {
  critterId: string
  type: CritterType
  points: number
}
