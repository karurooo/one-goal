export function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 text-center">
      <p className="font-heading text-3xl text-court">{value}</p>
      <p className="mt-1 text-sm text-ink-2">{label}</p>
    </div>
  )
}
