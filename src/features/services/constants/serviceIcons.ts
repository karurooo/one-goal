import { CalendarDays, Dumbbell, MapPin, Medal, Trophy, Users, type LucideIcon } from 'lucide-react'
import { createElement, type ReactElement } from 'react'

// Allowed names are listed in content-model §5; unknown names fall back to Trophy (AC-SVC-01).
const icons = new Map<string, LucideIcon>([
  ['Trophy', Trophy],
  ['Medal', Medal],
  ['MapPin', MapPin],
  ['CalendarDays', CalendarDays],
  ['Dumbbell', Dumbbell],
  ['Users', Users],
])

// createElement keeps the lookup out of render-time JSX (react-hooks/static-components).
export const renderServiceIcon = (name: string, className: string): ReactElement =>
  createElement(icons.get(name) ?? Trophy, { 'aria-hidden': true, className })
