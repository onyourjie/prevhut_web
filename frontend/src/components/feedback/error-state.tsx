import { AlertTriangle } from "lucide-react";
import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  message: string
  onRetry?: () => void
  lastUpdated?: string
}

export function ErrorState({
  title = 'Terjadi Gangguan Data',
  message,
  onRetry,
  lastUpdated,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'p-6 rounded-[var(--radius-md)] border border-error-200 bg-error-50 flex flex-col items-center justify-center text-center gap-3',
        className,
      )}
      {...props}
    >
      <div className="w-10 h-10 rounded-full bg-error-100 flex items-center justify-center text-lg text-error-700">
        <AlertTriangle className="w-5 h-5 text-error-700" />
      </div>

      <div className="flex flex-col gap-1 max-w-sm">
        <h4 className="text-sm font-bold text-error-700">{title}</h4>
        <p className="text-xs text-neutral-800 leading-relaxed">{message}</p>
        {lastUpdated && (
          <p className="text-[11px] text-neutral-600 mt-1">
            Data mungkin tertunda (terakhir diperbarui: {lastUpdated})
          </p>
        )}
      </div>

      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry} className="mt-1">
          Coba Lagi
        </Button>
      )}
    </div>
  )
}
