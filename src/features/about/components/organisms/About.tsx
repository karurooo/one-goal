import { Section } from '@/components/layout/AppShell'
import { content } from '@/content'
import { MandateCard } from '../molecules/MandateCard'

export function About({ about = content.about }: { about?: typeof content.about }) {
  return (
    <Section id="about" eyebrow="About us" title={content.headings.about}>
      <div className="grid gap-10 lg:grid-cols-2">
        <p className="text-lg leading-relaxed text-ink-2">{about.intro}</p>
        <MandateCard items={about.mandate} />
      </div>
    </Section>
  )
}
