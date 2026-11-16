import { Section } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/card'
import { content } from '@/content'
import { ContactDetails } from '../molecules/ContactDetails'
import { ContactForm } from '../molecules/ContactForm'

export function Contact() {
  return (
    <Section id="contact" eyebrow="Contact" title={content.headings.contact}>
      <div className="grid gap-10 lg:grid-cols-2">
        <ContactDetails />
        <Card className="rounded-2xl p-6 md:p-8">
          <h3 className="text-xl">{content.contact.formTitle}</h3>
          <ContactForm />
        </Card>
      </div>
    </Section>
  )
}
