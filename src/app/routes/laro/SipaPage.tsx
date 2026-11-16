import { Link } from 'react-router-dom'

// Placeholder: the game arrives with T-SIPA-02.
export function SipaPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl">Sipa</h1>
      <p className="mt-2">Coming soon.</p>
      <Link to="/" className="mt-4 inline-block underline">
        Back to site
      </Link>
    </main>
  )
}
