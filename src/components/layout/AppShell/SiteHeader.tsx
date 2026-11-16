import { content } from '@/content'
import { LogoMark } from './LogoMark'
import { NavLinks, type NavItem } from './NavLinks'

// `nav` defaults to office.json so adding an item there updates the header (AC-NAV-05).
export function SiteHeader({ nav = content.nav }: { nav?: NavItem[] }) {
  return (
    <header className="sticky top-0 z-40 bg-navy text-white [&_:focus-visible]:outline-gold">
      <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-4 md:h-[68px]">
        <a href="#home" className="flex min-h-11 items-center gap-2 rounded-lg">
          <LogoMark />
          <span className="font-heading text-lg tracking-wide uppercase">
            {content.office.short}
          </span>
        </a>
        <NavLinks items={nav} />
      </div>
    </header>
  )
}
