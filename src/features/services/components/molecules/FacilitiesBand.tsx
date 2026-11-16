import { CheckIcon } from 'lucide-react'
import { content } from '@/content'

const { items, note } = content.facilities

export function FacilitiesBand() {
  return (
    <div className="mt-10 rounded-2xl bg-navy p-6 text-white md:p-10">
      <h3 className="text-2xl">Facilities</h3>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3">
            <CheckIcon aria-hidden="true" className="size-5 shrink-0 text-gold" />
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-6 border-t border-white/20 pt-6 text-mist">{note}</p>
    </div>
  )
}
