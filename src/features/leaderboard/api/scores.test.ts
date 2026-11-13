import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const rpc = vi.fn()
  const query = {
    select: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
  }
  query.select.mockReturnValue(query)
  query.order.mockReturnValue(query)
  return {
    rpc,
    query,
    from: vi.fn(() => query),
    ensureSession: vi.fn(),
    online: true,
  }
})

vi.mock('@/lib/supabase', () => ({
  get supabase() {
    return mocks.online ? { rpc: mocks.rpc, from: mocks.from } : null
  },
  ensureSession: mocks.ensureSession,
}))

import {
  fetchTop10,
  OFFLINE_MESSAGE,
  submitScore,
} from '@/features/leaderboard/api/scores'

const input = { nickname: 'Carlo', score: 500, caught: 20, bestCombo: 5 }

beforeEach(() => {
  mocks.online = true
  mocks.rpc.mockReset()
  mocks.ensureSession.mockReset()
})

describe('submitScore', () => {
  it('throws the offline error when supabase is not configured', async () => {
    mocks.online = false
    await expect(submitScore(input)).rejects.toThrow(OFFLINE_MESSAGE)
    expect(mocks.rpc).not.toHaveBeenCalled()
  })

  it('ensures a session, then calls submit_score with snake_case args', async () => {
    const row = { id: '1', ...input }
    mocks.rpc.mockResolvedValue({ data: row, error: null })

    await expect(submitScore(input)).resolves.toBe(row)
    expect(mocks.ensureSession).toHaveBeenCalledOnce()
    expect(mocks.rpc).toHaveBeenCalledWith('submit_score', {
      nickname: 'Carlo',
      score: 500,
      caught: 20,
      best_combo: 5,
    })
  })

  it('rethrows the RPC error message', async () => {
    mocks.rpc.mockResolvedValue({
      data: null,
      error: { message: 'please wait before submitting again' },
    })
    await expect(submitScore(input)).rejects.toThrow(
      'please wait before submitting again',
    )
  })
})

describe('fetchTop10', () => {
  it('throws the offline error when supabase is not configured', async () => {
    mocks.online = false
    await expect(fetchTop10()).rejects.toThrow(OFFLINE_MESSAGE)
  })

  it('orders by score desc, created_at asc and limits to 10', async () => {
    mocks.query.limit.mockResolvedValue({ data: [], error: null })

    await expect(fetchTop10()).resolves.toEqual([])
    expect(mocks.from).toHaveBeenCalledWith('scores')
    expect(mocks.query.order).toHaveBeenNthCalledWith(1, 'score', {
      ascending: false,
    })
    expect(mocks.query.order).toHaveBeenNthCalledWith(2, 'created_at', {
      ascending: true,
    })
    expect(mocks.query.limit).toHaveBeenCalledWith(10)
  })
})
