import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { content } from '@/content'
import { About } from './About'

const withStats = (values: string[]) => ({
  ...content.about,
  stats: content.about.stats.map((stat, i) => ({ ...stat, value: values[i] ?? '1' })),
})

describe('About', () => {
  it('AC-ABOUT-01: renders the intro and every mandate item', () => {
    render(<About />)
    expect(screen.getByText(content.about.intro)).toBeInTheDocument()
    for (const item of content.about.mandate) expect(screen.getByText(item)).toBeInTheDocument()
  })

  it('TC-ABOUT-01: hides the stat tiles while any value is a placeholder', () => {
    render(<About about={withStats(['12', '[#]', '3'])} />)
    for (const { label } of content.about.stats) expect(screen.queryByText(label)).toBeNull()
  })

  it('shows all three stat tiles once every value is a real number', () => {
    render(<About about={withStats(['12', '86', '3'])} />)
    for (const { label } of content.about.stats) expect(screen.getByText(label)).toBeInTheDocument()
    expect(screen.getByText('86')).toBeInTheDocument()
  })
})
