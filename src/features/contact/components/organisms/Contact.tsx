import { Section } from '@/components/layout/AppShell'
import { content } from '@/content'
import { ContactDetails } from '../molecules/ContactDetails'

export function Contact() {
  return (
    <Section id="contact" eyebrow="Contact" title={content.headings.contact}>
      <div className="grid gap-10 lg:grid-cols-2">
        <ContactDetails />
      </div>
    </Section>
  )
}
