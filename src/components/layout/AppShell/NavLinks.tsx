import type { OfficeContent } from '@/content/schema'

export type NavItem = OfficeContent['nav'][number]

export function NavLinks({ items }: { items: NavItem[] }) {
  return (
    <nav aria-label="Primary" className="hidden md:block">
      <ul className="flex items-center gap-1">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="inline-flex min-h-11 items-center rounded-lg px-3 text-[15px] font-medium text-mist hover:text-white"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
