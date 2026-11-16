import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { routes } from '@/app/router'

describe('NotFoundPage', () => {
  it('TC-NAV-03: unknown route shows the 404 page with a link to /', () => {
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/nope'] })} />)
    expect(screen.getByRole('heading', { name: 'Out of bounds.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/')
  })
})
