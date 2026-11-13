import * as React from 'react'

import { cn } from '@/lib/utils'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-muted/40 p-6',
        className,
      )}
      {...props}
    />
  )
}

export { Card }
