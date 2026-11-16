import { CheckIcon } from 'lucide-react'

export function CheckItem({ children }: { children: string }) {
  return (
    <li className="flex items-start gap-3">
      <CheckIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-court" />
      <span>{children}</span>
    </li>
  )
}
