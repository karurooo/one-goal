import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'

import { PlayPage } from '@/app/routes/play/PlayPage'
import { useGameStore } from '@/features/game'

const initialState = useGameStore.getState()

beforeEach(() => {
  useGameStore.setState(initialState, true)
})

describe('PlayPage', () => {
  it('shows the current screen and changes to playing when Play is clicked', () => {
    render(
      <MemoryRouter>
        <PlayPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('start')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /play/i }))

    expect(screen.getByText('playing')).toBeInTheDocument()
  })
})
