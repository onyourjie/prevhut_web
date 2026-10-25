import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  onBack?: () => void
  action?: React.ReactNode
}

export function PageHeader({
  title,
  subtitle,
  onBack,
  action,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between min-h-[56px] gap-2',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2 text-left">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-[var(--radius-sm)] text-neutral-700 hover:bg-neutral-100 focus-ring"
            aria-label="Kembali ke halaman sebelumnya"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
        <div className="flex flex-col">
          <h1 className="text-base font-bold text-neutral-1000 leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-neutral-600 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}
