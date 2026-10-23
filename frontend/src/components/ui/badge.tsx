import React from 'react'
import { cn } from '@/lib/utils'

export type BadgeVariant = 'success' | 'danger' | 'warning' | 'neutral' | 'accent'
export type RiskLevel = 'high' | 'medium' | 'low' | 'nodata'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  icon?: React.ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-success-50 text-success-900 border border-success-200',
  danger: 'bg-error-50 text-error-700 border border-error-200',
  warning: 'bg-warning-50 text-warning-900 border border-warning-200',
  neutral: 'bg-neutral-50 text-neutral-700 border border-neutral-200',
  accent: 'bg-accent-50 text-accent-900 border border-accent-200',
}

export function Badge({ children, variant = 'neutral', icon, className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[var(--radius-full)] text-xs font-semibold select-none',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0 text-current">{icon}</span>}
      <span>{children}</span>
    </span>
  )
}

export interface RiskBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  level: RiskLevel
}

const riskConfig: Record<RiskLevel, { label: string; variant: BadgeVariant; iconText: string }> = {
  high: { label: 'Risiko Tinggi', variant: 'danger', iconText: '▲' },
  medium: { label: 'Risiko Sedang', variant: 'warning', iconText: '!' },
  low: { label: 'Risiko Rendah', variant: 'accent', iconText: '●' },
  nodata: { label: 'Belum ada data', variant: 'neutral', iconText: '—' },
}

export function RiskBadge({ level, className, ...props }: RiskBadgeProps) {
  const config = riskConfig[level]
  return (
    <Badge
      variant={config.variant}
      className={cn('font-bold', className)}
      icon={<span aria-hidden="true">{config.iconText}</span>}
      {...props}
    >
      {config.label}
    </Badge>
  )
}
