import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ContactForm } from './ContactForm'

vi.mock('sonner', () => ({ toast: { success: vi.fn() } }))

afterEach(() => vi.restoreAllMocks())

async function fill(name: string, email: string, message: string) {
  const user = userEvent.setup()
  render(<ContactForm />)
  // user-event refuses to type an empty string
  for (const [label, value] of [
    ['Name', name],
    ['Email', email],
    ['Message', message],
  ] as const) {
    if (value) await user.type(screen.getByLabelText(label), value)
  }
  await user.click(screen.getByRole('button', { name: 'Send message' }))
}

describe('ContactForm', () => {
  it('TC-CONTACT-01: an invalid email shows an inline error and keeps the form filled', async () => {
    await fill('Juan', 'not-an-email', 'Hello, this is long enough.')

    const email = screen.getByLabelText('Email')
    expect(email).toHaveAttribute('aria-invalid', 'true')
    expect(email).toHaveAccessibleDescription('Please enter a valid email address.')
    expect(screen.getByLabelText('Name')).toHaveValue('Juan')
    expect(toast.success).not.toHaveBeenCalled()
  })

  it('shows errors for an empty name and a short message', async () => {
    await fill('', 'juan@example.com', 'short')

    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Message')).toHaveAttribute('aria-invalid', 'true')
  })

  it('TC-CONTACT-02: a valid submit clears the fields, shows the toast and sends nothing', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    await fill('Juan', 'juan@example.com', 'Hello, this is long enough.')

    expect(screen.getByLabelText('Name')).toHaveValue('')
    expect(screen.getByLabelText('Email')).toHaveValue('')
    expect(screen.getByLabelText('Message')).toHaveValue('')
    expect(toast.success).toHaveBeenCalledWith(
      'Salamat! This is a practice site, so nothing was sent.',
    )
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
