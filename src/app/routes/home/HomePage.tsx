import { SiteHeader, SkipLink } from '@/components/layout/AppShell'
import { Hero } from '@/features/hero'

// Empty sections stay as plain placeholders until their tasks land; ids match the nav hrefs.
export function HomePage() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main">
        <Hero />
        <section id="about" />
        <section id="services" />
        <section id="laro" />
        <section id="contact" />
      </main>
    </>
  )
}
