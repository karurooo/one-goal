/**
 * Every tuning number from the PRD, owned by A (features/game). Values are
 * the ones already fixed in docs/Scatter & Catch Team Plan.md; anything not
 * yet specified there is a placeholder for A to confirm in Sprint 1-3.
 */
export const CONFIG = {
  roundSeconds: 30,
  pointsPerCatch: 10,
  catchRadiusPadding: 8, // px added to critter radius for a successful tap
  minCritters: 5, // respawn threshold

  difficultyPhases: {
    // seconds remaining at which each phase starts
    phase1At: 20,
    phase2At: 10,
    speedMultiplier: { phase0: 1.0, phase1: 1.3, phase2: 1.6 },
    fastCritterCount: { phase0: 0, phase1: 2, phase2: 4 },
    bombCount: { phase0: 0, phase1: 1, phase2: 2 },
  },

  fastCritter: {
    bonusPoints: 25,
    radius: 160,
  },

  combo: {
    pointsPerStep: 5,
    capWithinMs: 1000,
    capPoints: 25,
  },

  bomb: {
    penaltyPoints: -20,
    scatterDurationMs: 2000,
    scatterMultiplier: 2,
  },
} as const
