import { beforeEach, describe, expect, it } from 'vitest'

import { useGameStore } from '@/features/game/stores/gameStore'

const initialState = useGameStore.getState()

beforeEach(() => {
  useGameStore.setState(initialState, true)
})

describe('gameStore', () => {
  it('walks the allowed transition path: start -> playing -> paused -> playing -> over -> start', () => {
    expect(useGameStore.getState().screen).toBe('start')

    useGameStore.getState().start()
    expect(useGameStore.getState().screen).toBe('playing')

    useGameStore.getState().pause()
    expect(useGameStore.getState().screen).toBe('paused')

    useGameStore.getState().resume()
    expect(useGameStore.getState().screen).toBe('playing')

    const stats = { score: 100, caught: 10, bestCombo: 3 }
    useGameStore.getState().over(stats)
    expect(useGameStore.getState().screen).toBe('over')
    expect(useGameStore.getState().lastRound).toEqual(stats)

    useGameStore.getState().toStart()
    expect(useGameStore.getState().screen).toBe('start')
  })

  it('ignores illegal transitions', () => {
    expect(useGameStore.getState().screen).toBe('start')

    useGameStore.getState().pause()
    expect(useGameStore.getState().screen).toBe('start')

    useGameStore.getState().resume()
    expect(useGameStore.getState().screen).toBe('start')

    useGameStore.getState().over({ score: 0, caught: 0, bestCombo: 0 })
    expect(useGameStore.getState().screen).toBe('start')

    useGameStore.getState().toStart()
    expect(useGameStore.getState().screen).toBe('start')
  })

  it('setHud and toggleMute are always allowed regardless of screen', () => {
    useGameStore.getState().setHud({ score: 50, timeRemaining: 20, combo: 2 })
    expect(useGameStore.getState().hud).toEqual({
      score: 50,
      timeRemaining: 20,
      combo: 2,
    })

    expect(useGameStore.getState().muted).toBe(false)
    useGameStore.getState().toggleMute()
    expect(useGameStore.getState().muted).toBe(true)
  })
})
