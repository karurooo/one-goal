import { SiteHeader, SkipLink } from '@/components/layout/AppShell'
import { About } from '@/features/about'
import { Hero } from '@/features/hero'

// Empty sections stay as plain placeholders until their tasks land; ids match the nav hrefs.
export function HomePage() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main">
        <Hero />
        <About />
        <section id="services" />
        <section id="laro" />
        <section id="contact" />
      </main>
    </>
  )
}
