import { Section } from '@/components/layout/AppShell'
import { content } from '@/content'
import { FacilitiesBand } from '../molecules/FacilitiesBand'
import { ServiceCard } from '../molecules/ServiceCard'

export function Services() {
  return (
    <Section id="services" eyebrow="Services" title={content.headings.services} className="bg-sand">
      {/* 4 columns at ≥ 1200 px, 2 at ≥ 640 px, 1 below (AC-SVC-02) */}
      <ul className="grid gap-4 min-[1200px]:grid-cols-4 sm:grid-cols-2">
        {content.services.map((service) => (
          <li key={service.title} className="flex">
            <ServiceCard {...service} />
          </li>
        ))}
      </ul>
      <FacilitiesBand />
    </Section>
  )
}
