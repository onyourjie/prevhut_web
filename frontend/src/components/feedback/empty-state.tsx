import React from 'react'
import { ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'p-8 rounded-[var(--radius-md)] border border-neutral-200 bg-neutral-25 flex flex-col items-center justify-center text-center gap-3',
        className,
      )}
      {...props}
    >
      <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 mb-1">
        {icon || <ClipboardList className="w-6 h-6" />}
      </div>
      <div className="flex flex-col gap-1 max-w-sm">
        <h3 className="text-base font-bold text-neutral-1000">{title}</h3>
        <p className="text-xs text-neutral-700 leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
