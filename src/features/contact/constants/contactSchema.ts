import { z } from 'zod'

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your name (at least 2 characters).')
    .max(80, 'Name is too long (80 characters at most).'),
  email: z.email('Please enter a valid email address.'),
  message: z
    .string()
    .trim()
    .min(10, 'Please write at least 10 characters.')
    .max(1000, 'Message is too long (1000 characters at most).'),
})

export type ContactValues = z.infer<typeof contactSchema>
