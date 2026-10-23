import React from 'react'
import { cn } from '@/lib/utils'

export interface SourceItem {
  sourceName: string
  observedTime: string
  label?: string
}

export interface SourceTimeLineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: SourceItem[]
}

export function SourceTimeLine({ items, className, ...props }: SourceTimeLineProps) {
  if (!items || items.length === 0) return null

  return (
    <div
      className={cn(
        'pt-2.5 mt-2.5 border-t border-neutral-100 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-700',
        className,
      )}
      {...props}
    >
      {items.map((item, index) => (
        <span key={index} className="inline-flex items-center gap-1">
          {index > 0 && <span aria-hidden="true" className="text-neutral-400">·</span>}
          <span>
            {item.label ? `${item.label}: ` : 'Sumber: '}
            <strong className="font-semibold text-neutral-800">{item.sourceName}</strong>
            {' • '}
            <span>{item.observedTime}</span>
          </span>
        </span>
      ))}
    </div>
  )
}
