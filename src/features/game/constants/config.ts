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

  movement: {
    wanderSpeed: 40, // px/s
    fleeSpeed: 160, // px/s
    fleeRadius: 120, // px: pointer closer than this triggers flee
    squashAmount: 0.3,
    squashDecayPerSecond: 2,
  },

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

  maxTapsPerSecond: 8, // assumed human ceiling (Q3), only used for MAX_SCORE
} as const

/**
 * P2-5: upper bound on a perfect round's score. Assumes every tap catches,
 * bombs are never tapped and the combo bonus is always at its cap.
 * Phase 0 has no fast critters, so each catch is pointsPerCatch + cap.
 * From phase 1 on, fast critters respawn to keep their count, so in the bound
 * every catch is a fast one: bonusPoints + cap.
 * Mirrored as a literal in submit_score() (S3-7); keep both in sync.
 */
const { roundSeconds, pointsPerCatch, maxTapsPerSecond, difficultyPhases } =
  CONFIG
const phase0Seconds = roundSeconds - difficultyPhases.phase1At
const comboCap = CONFIG.combo.capPoints

export const MAX_SCORE =
  maxTapsPerSecond * phase0Seconds * (pointsPerCatch + comboCap) +
  maxTapsPerSecond *
    difficultyPhases.phase1At *
    (CONFIG.fastCritter.bonusPoints + comboCap)
