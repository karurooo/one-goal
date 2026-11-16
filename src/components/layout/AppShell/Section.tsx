import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type SectionProps = {
  id: string
  title: string
  eyebrow?: string
  className?: string
  children: ReactNode
}

// Page section template: eyebrow + h2 + content. scroll-mt keeps the title below the sticky header.
export function Section({ id, title, eyebrow, className, children }: SectionProps) {
  return (
    <section id={id} className={cn('scroll-mt-[68px] px-4 py-16 md:py-20', className)}>
      <div className="mx-auto max-w-6xl">
        {eyebrow && (
          <p className="mb-3 text-xs font-bold tracking-[0.12em] text-court uppercase">{eyebrow}</p>
        )}
        <h2 className="text-3xl md:text-[44px] md:leading-tight">{title}</h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}
