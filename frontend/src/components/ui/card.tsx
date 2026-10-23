import React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'muted' | 'danger-tint' | 'warning-tint' | 'accent-tint' | 'accent-solid'
}

const cardVariantStyles: Record<NonNullable<CardProps['variant']>, string> = {
  default: 'bg-white border-neutral-200 text-neutral-1000',
  muted: 'bg-neutral-25 border-neutral-200 text-neutral-1000',
  'danger-tint': 'bg-error-50 border-error-200 text-neutral-1000',
  'warning-tint': 'bg-warning-50 border-warning-200 text-neutral-1000',
  'accent-tint': 'bg-accent-50 border-accent-200 text-neutral-1000',
  'accent-solid': 'bg-accent-900 border-accent-950 text-white',
}

export function Card({ children, variant = 'default', className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-md)] border p-4 text-left shadow-xs',
        cardVariantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'hotspot' | 'weather' | 'posko'
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
}

export function MetricCard({
  type,
  title,
  value,
  subtitle,
  icon,
  className,
  ...props
}: MetricCardProps) {
  if (type === 'posko') {
    return (
      <div
        className={cn(
          'p-3.5 rounded-[var(--radius-md)] bg-accent-900 text-white flex flex-col justify-between min-h-[96px]',
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-between text-xs text-accent-100 font-medium">
          <span>{title}</span>
          {icon && <span>{icon}</span>}
        </div>
        <div>
          <div className="text-xl font-bold tracking-tight">{value}</div>
          {subtitle && <div className="text-xs text-accent-200 mt-0.5">{subtitle}</div>}
        </div>
      </div>
    )
  }

  if (type === 'weather') {
    return (
      <div
        className={cn(
          'p-3.5 rounded-[var(--radius-md)] bg-white border border-accent-300 flex flex-col justify-between min-h-[96px]',
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-between text-xs text-neutral-700 font-medium">
          <span>{title}</span>
          {icon && <span>{icon}</span>}
        </div>
        <div>
          <div className="text-xl font-bold text-neutral-1000">{value}</div>
          {subtitle && <div className="text-xs text-neutral-600 mt-0.5">{subtitle}</div>}
        </div>
      </div>
    )
  }

  // Hotspot
  return (
    <div
      className={cn(
        'p-3.5 rounded-[var(--radius-md)] bg-white border border-error-300 flex flex-col justify-between min-h-[96px]',
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between text-xs text-neutral-700 font-medium">
        <span>{title}</span>
        {icon && <span>{icon}</span>}
      </div>
      <div>
        <div className="text-xl font-bold text-error-700">{value}</div>
        {subtitle && <div className="text-xs text-neutral-600 mt-0.5">{subtitle}</div>}
      </div>
    </div>
  )
}
