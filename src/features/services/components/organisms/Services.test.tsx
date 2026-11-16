import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { content } from '@/content'
import { ServiceCard } from '../molecules/ServiceCard'
import { Services } from './Services'

describe('Services', () => {
  it('AC-SVC-01: renders one card per service', () => {
    render(<Services />)
    for (const { title, text } of content.services) {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
      expect(screen.getByText(text)).toBeInTheDocument()
    }
  })

  it('AC-SVC-03: shows every facility and the request note', () => {
    render(<Services />)
    for (const item of content.facilities.items) expect(screen.getByText(item)).toBeInTheDocument()
    expect(screen.getByText(content.facilities.note)).toBeInTheDocument()
  })

  it('TC-SVC-01: an unknown icon name renders the fallback icon', () => {
    const { container } = render(<ServiceCard icon="NotAnIcon" title="Title" text="Text" />)
    expect(container.querySelector('svg.lucide-trophy')).not.toBeNull()
  })

  it('maps a known icon name to its own icon', () => {
    const { container } = render(<ServiceCard icon="Medal" title="Title" text="Text" />)
    expect(container.querySelector('svg.lucide-medal')).not.toBeNull()
  })
})
