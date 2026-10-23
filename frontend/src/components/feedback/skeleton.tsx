import React from 'react'
import { cn } from '@/lib/utils'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: 'text' | 'rect' | 'circle'
}

export function Skeleton({ shape = 'rect', className, ...props }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Memuat data"
      className={cn(
        'bg-neutral-100 select-none pointer-events-none',
        shape === 'circle' && 'rounded-full',
        shape === 'text' && 'h-4 w-3/4 rounded-[4px]',
        shape === 'rect' && 'rounded-[var(--radius-sm)]',
        className,
      )}
      {...props}
    >
      <span className="sr-only">Memuat...</span>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div
      role="status"
      aria-label="Memuat kartu data"
      className="p-4 rounded-[var(--radius-md)] border border-neutral-200 bg-white flex flex-col gap-3 w-full"
    >
      <div className="flex items-center justify-between">
        <Skeleton shape="text" className="w-1/3 h-5" />
        <Skeleton shape="rect" className="w-16 h-6 rounded-full" />
      </div>
      <Skeleton shape="text" className="w-full h-4" />
      <Skeleton shape="text" className="w-4/5 h-4" />
      <div className="pt-2 border-t border-neutral-100 flex gap-2">
        <Skeleton shape="text" className="w-1/2 h-3" />
      </div>
      <span className="sr-only">Memuat...</span>
    </div>
  )
}
