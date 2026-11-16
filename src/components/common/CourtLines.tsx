// Decorative court markings behind the hero (AC-HERO-03: aria-hidden).
export function CourtLines() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 size-full text-white opacity-[0.18]"
    >
      <g fill="none" stroke="currentColor" strokeWidth="3">
        <rect x="60" y="40" width="1080" height="520" rx="8" />
        <path d="M600 40v520" />
        <circle cx="600" cy="300" r="90" />
        <path d="M60 170h160v260H60M1140 170H980v260h160" />
      </g>
    </svg>
  )
}
