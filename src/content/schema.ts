import { z } from 'zod'

const link = z.object({ label: z.string().min(1), href: z.string().startsWith('#') })
const placeholderOrNumber = z.string().regex(/^(\[#\]|\d[\d,]*\+?)$/) // "[#]" or "86" or "1,200+"

export const officeContentSchema = z.object({
  office: z.object({ name: z.string(), lgu: z.string(), short: z.string() }),
  nav: z.array(link).min(1),
  hero: z.object({
    headline: z.string(),
    tagline: z.string(),
    primaryCta: link,
    secondaryCta: link,
  }),
  headings: z.object({ about: z.string(), services: z.string(), contact: z.string() }),
  about: z.object({
    intro: z.string(),
    mandate: z.array(z.string()).min(1),
    stats: z.array(z.object({ value: placeholderOrNumber, label: z.string() })).length(3),
  }),
  services: z.array(z.object({ icon: z.string(), title: z.string(), text: z.string() })).min(1),
  facilities: z.object({ items: z.array(z.string()).min(1), note: z.string() }),
  laro: z.object({
    title: z.string(),
    intro: z.string(),
    sipa: z.object({ title: z.string(), text: z.string(), cta: z.string() }),
    sabong: z.object({ title: z.string(), text: z.string(), cta: z.string() }),
  }),
  contact: z.object({
    address: z.string(),
    hours: z.string(),
    phone: z.string(),
    email: z.email(),
    formTitle: z.string(),
  }),
  footer: z.object({ text: z.string(), disclaimer: z.string() }),
})

export type OfficeContent = z.infer<typeof officeContentSchema>
