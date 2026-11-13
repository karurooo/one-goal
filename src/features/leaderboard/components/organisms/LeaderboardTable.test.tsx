import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  online: true,
  limit: vi.fn(),
}))

vi.mock('@/lib/supabase', () => {
  const query = {
    select: () => query,
    order: () => query,
    limit: mocks.limit,
  }
  return {
    get supabase() {
      return mocks.online ? { from: () => query } : null
    },
    ensureSession: vi.fn(),
  }
})

import { LeaderboardTable } from '@/features/leaderboard/components/organisms/LeaderboardTable'

function renderTable() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <LeaderboardTable />
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  mocks.online = true
  mocks.limit.mockReset()
})

describe('LeaderboardTable', () => {
  it('shows the offline message without querying when supabase is null', () => {
    mocks.online = false
    renderTable()
    expect(screen.getByRole('status')).toHaveTextContent(/offline/i)
    expect(mocks.limit).not.toHaveBeenCalled()
  })

  it('shows the empty state', async () => {
    mocks.limit.mockResolvedValue({ data: [], error: null })
    renderTable()
    expect(await screen.findByText(/no scores yet/i)).toBeInTheDocument()
  })

  it('shows an error with a retry button', async () => {
    mocks.limit.mockResolvedValue({ data: null, error: { message: 'boom' } })
    renderTable()
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /try again/i }),
    ).toBeInTheDocument()
  })

  it('ranks rows in the order returned', async () => {
    mocks.limit.mockResolvedValue({
      data: [
        { id: 'a', nickname: 'Alpha', score: 900 },
        { id: 'b', nickname: 'Bravo', score: 400 },
      ],
      error: null,
    })
    renderTable()
    const rows = await screen.findAllByRole('row')
    expect(rows[1]).toHaveTextContent('1Alpha900')
    expect(rows[2]).toHaveTextContent('2Bravo400')
  })
})
