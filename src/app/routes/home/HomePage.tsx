import { SkipLink } from '@/components/layout/AppShell'

// Sections are empty until their tasks land; ids match the nav hrefs in office.json.
const sectionIds = ['home', 'about', 'services', 'laro', 'contact'] as const

export function HomePage() {
  return (
    <>
      <SkipLink />
      <main id="main">
        {sectionIds.map((id) => (
          <section key={id} id={id} />
        ))}
      </main>
    </>
  )
}
