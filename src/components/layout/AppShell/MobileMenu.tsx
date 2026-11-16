import { MenuIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { NavItem } from './NavLinks'

const iconButton = 'size-11 text-white hover:bg-white/10 hover:text-white'

// Radix Dialog supplies aria-expanded, the focus trap, Esc to close and focus return.
export function MobileMenu({ items }: { items: NavItem[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" aria-label="Open menu" className={`${iconButton} md:hidden`}>
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="border-white/10 bg-navy text-white [&_:focus-visible]:outline-gold"
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SheetDescription className="sr-only">Jump to a section of the page</SheetDescription>
        <SheetClose asChild>
          <Button
            variant="ghost"
            aria-label="Close menu"
            className={`${iconButton} absolute top-2 right-2`}
          >
            <XIcon />
          </Button>
        </SheetClose>
        <nav aria-label="Mobile" className="mt-16">
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <SheetClose asChild>
                  <a
                    href={item.href}
                    className="flex h-14 items-center border-b border-white/10 px-6 text-lg font-medium"
                  >
                    {item.label}
                  </a>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
