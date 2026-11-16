// Woven rattan sipa ball, our own artwork (AC-HERO-03: aria-hidden).
export function SipaBallArt({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" className={className}>
      <circle cx="100" cy="100" r="92" fill="var(--color-gold)" />
      <g fill="none" stroke="var(--color-navy)" strokeWidth="5" strokeLinecap="round">
        <path d="M18 70c50 28 114 28 164 0" />
        <path d="M18 130c50-28 114-28 164 0" />
        <path d="M100 8c-42 54-42 130 0 184" />
        <path d="M100 8c42 54 42 130 0 184" />
        <path d="M30 40c40 40 100 100 140 120" />
        <path d="M170 40C130 80 70 140 30 160" />
      </g>
    </svg>
  )
}
