import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { SiteHeader } from './SiteHeader'

const nav = Array.from({ length: 6 }, (_, i) => ({ label: `Item ${i + 1}`, href: `#s${i + 1}` }))

describe('SiteHeader', () => {
  it('TC-NAV-01: renders one link per nav item', () => {
    render(<SiteHeader nav={nav} />)
    const links = within(screen.getByRole('navigation', { name: 'Primary' })).getAllByRole('link')
    expect(links.map((a) => [a.textContent, a.getAttribute('href')])).toEqual(
      nav.map((n) => [n.label, n.href]),
    )
  })

  it('TC-NAV-02: menu button opens the menu and choosing a link closes it', async () => {
    const user = userEvent.setup()
    render(<SiteHeader nav={nav} />)

    const button = screen.getByRole('button', { name: 'Open menu' })
    expect(button).toHaveAttribute('aria-expanded', 'false')

    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    const menu = screen.getByRole('dialog')

    await user.click(within(menu).getByRole('link', { name: 'Item 2' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})
