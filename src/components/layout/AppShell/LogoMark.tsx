// Decorative: our own woven-ball mark, no city seal (NFR-CONT-02).
export function LogoMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className="size-8 shrink-0 text-gold">
      <circle cx="16" cy="16" r="15" fill="currentColor" />
      <path
        d="M4 12c8 4 16 4 24 0M4 20c8-4 16-4 24 0M16 1c-5 8-5 22 0 30"
        fill="none"
        stroke="var(--color-navy)"
        strokeWidth="2"
      />
    </svg>
  )
}
