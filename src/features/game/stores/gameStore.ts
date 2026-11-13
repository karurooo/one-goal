import { create } from 'zustand'

import type { GameScreen, HudValues, RoundStats } from '@/features/game/types'

type GameStoreState = {
  screen: GameScreen
  hud: HudValues
  lastRound: RoundStats | null
  muted: boolean
  start: () => void
  pause: () => void
  resume: () => void
  over: (stats: RoundStats) => void
  toStart: () => void
  setHud: (hud: HudValues) => void
  toggleMute: () => void
}

const initialHud: HudValues = { score: 0, timeRemaining: 0, combo: 0 }

/**
 * Screen state machine (owned by C). Illegal transitions are ignored, e.g.
 * pause() while on 'start' does nothing. Allowed path:
 * start -> playing -> paused -> playing -> over -> start.
 */
export const useGameStore = create<GameStoreState>((set, get) => ({
  screen: 'start',
  hud: initialHud,
  lastRound: null,
  muted: false,

  start: () => {
    if (get().screen !== 'start') return
    set({ screen: 'playing' })
  },

  pause: () => {
    if (get().screen !== 'playing') return
    set({ screen: 'paused' })
  },

  resume: () => {
    if (get().screen !== 'paused') return
    set({ screen: 'playing' })
  },

  over: (stats) => {
    if (get().screen !== 'playing') return
    set({ screen: 'over', lastRound: stats })
  },

  toStart: () => {
    if (get().screen !== 'over') return
    set({ screen: 'start' })
  },

  setHud: (hud) => set({ hud }),

  toggleMute: () => set((state) => ({ muted: !state.muted })),
}))
