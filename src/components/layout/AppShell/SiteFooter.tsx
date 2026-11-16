import { content } from '@/content'

const { text, disclaimer } = content.footer

export function SiteFooter() {
  return (
    <footer className="bg-navy px-4 py-10 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="font-heading">{text}</p>
        <p className="hidden max-w-xl text-sm text-mist md:block">{disclaimer}</p>
      </div>
    </footer>
  )
}
