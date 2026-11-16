import { Link } from 'react-router-dom'

// Minimal for now; T-LAYOUT-01 brings the final design and its tests.
export function NotFoundPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl">Page not found</h1>
      <Link to="/" className="mt-4 inline-block underline">
        Back to home
      </Link>
    </main>
  )
}
