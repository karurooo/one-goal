import { SiteFooter, SiteHeader, SkipLink } from '@/components/layout/AppShell'
import { About } from '@/features/about'
import { Contact } from '@/features/contact'
import { Hero } from '@/features/hero'
import { Services } from '@/features/services'

// Empty sections stay as plain placeholders until their tasks land; ids match the nav hrefs.
export function HomePage() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main">
        <Hero />
        <About />
        <Services />
        <section id="laro" />
        <Contact />
      </main>
      <SiteFooter />
    </>
  )
}
