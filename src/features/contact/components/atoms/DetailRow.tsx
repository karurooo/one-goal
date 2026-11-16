import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type DetailRowProps = { icon: LucideIcon; label: string; children: ReactNode }

export function DetailRow({ icon: Icon, label, children }: DetailRowProps) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-court text-white">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div>
        <dt className="text-xs font-bold tracking-[0.12em] text-court uppercase">{label}</dt>
        <dd className="mt-1 text-lg">{children}</dd>
      </div>
    </div>
  )
}
