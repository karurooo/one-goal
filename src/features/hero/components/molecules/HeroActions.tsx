import { Button } from '@/components/ui/button'
import { content } from '@/content'

const { primaryCta, secondaryCta } = content.hero

export function HeroActions() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button asChild size="lg" className="h-12 px-6 text-base font-bold sm:w-auto">
        <a href={primaryCta.href}>{primaryCta.label}</a>
      </Button>
      <Button
        asChild
        size="lg"
        variant="outline"
        className="h-12 border-white/40 bg-transparent px-6 text-base font-bold text-white hover:bg-white/10 hover:text-white sm:w-auto"
      >
        <a href={secondaryCta.href}>{secondaryCta.label}</a>
      </Button>
    </div>
  )
}
