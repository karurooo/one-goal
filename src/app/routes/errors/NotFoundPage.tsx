import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-navy px-4 text-center text-white">
      <h1 className="text-5xl md:text-7xl">Out of bounds.</h1>
      <p className="text-lg text-mist">This page isn&apos;t on our court.</p>
      <Button asChild size="lg" className="mt-4 h-11 px-6 text-base font-semibold">
        <Link to="/">Back to home</Link>
      </Button>
    </main>
  )
}
