import { content } from '@/content'
import { HeroActions } from '../molecules/HeroActions'

const { headline, tagline } = content.hero

export function Hero() {
  return (
    <section
      id="home"
      className="relative scroll-mt-[68px] overflow-hidden bg-navy text-white [&_:focus-visible]:outline-gold"
    >
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:py-24 lg:grid-cols-2">
        <div>
          <p className="mb-4 text-xs font-bold tracking-[0.12em] text-gold uppercase">
            {content.office.name}
          </p>
          <h1 className="text-[44px] leading-[1.02] md:text-[76px]">{headline}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist md:text-xl">{tagline}</p>
          <div className="mt-8">
            <HeroActions />
          </div>
        </div>
      </div>
    </section>
  )
}
