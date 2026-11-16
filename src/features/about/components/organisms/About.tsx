import { Section } from '@/components/layout/AppShell'
import { content } from '@/content'
import { StatTile } from '../atoms/StatTile'
import { MandateCard } from '../molecules/MandateCard'

export function About({ about = content.about }: { about?: typeof content.about }) {
  // We never show invented numbers: hide every tile while any value is still "[#]" (AC-ABOUT-02).
  const showStats = about.stats.every((stat) => stat.value !== '[#]')

  return (
    <Section id="about" eyebrow="About us" title={content.headings.about}>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="text-lg leading-relaxed text-ink-2">{about.intro}</p>
          {showStats && (
            <div className="mt-8 grid grid-cols-3 gap-3">
              {about.stats.map((stat) => (
                <StatTile key={stat.label} {...stat} />
              ))}
            </div>
          )}
        </div>
        <MandateCard items={about.mandate} />
      </div>
    </Section>
  )
}
