import React from 'react'
import { cn } from '@/lib/utils'

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number // 0 - 100
  label?: string
  showPercentage?: boolean
  variant?: 'brand' | 'danger' | 'warning' | 'success' | 'accent'
}

const variantFillStyles = {
  brand: 'bg-brand-700',
  danger: 'bg-error-600',
  warning: 'bg-warning-600',
  success: 'bg-success-700',
  accent: 'bg-accent-900',
}

export function ProgressBar({
  value,
  label,
  showPercentage = true,
  variant = 'brand',
  className,
  ...props
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))

  return (
    <div className={cn('flex flex-col gap-1.5 w-full text-left', className)} {...props}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-semibold text-neutral-1000">
          {label && <span>{label}</span>}
          {showPercentage && <span>{Math.round(clampedValue)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden"
      >
        <div
          className={cn('h-full transition-all duration-200', variantFillStyles[variant])}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  )
}

export interface ProgressCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number // 0 - 100
  size?: number
  strokeWidth?: number
  label?: string
  variant?: 'brand' | 'danger' | 'warning' | 'success' | 'accent'
}

const variantStrokeColors = {
  brand: 'var(--color-brand-700)',
  danger: 'var(--color-error-600)',
  warning: 'var(--color-warning-600)',
  success: 'var(--color-success-700)',
  accent: 'var(--color-accent-900)',
}

export function ProgressCircle({
  value,
  size = 64,
  strokeWidth = 6,
  label,
  variant = 'brand',
  className,
  ...props
}: ProgressCircleProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference

  return (
    <div
      className={cn('inline-flex flex-col items-center justify-center', className)}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      {...props}
    >
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--color-neutral-100)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={variantStrokeColors[variant]}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-200"
          />
        </svg>
        <div className="absolute text-center flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-neutral-1000">{Math.round(clampedValue)}%</span>
        </div>
      </div>
      {label && <span className="text-xs text-neutral-700 mt-1 font-medium">{label}</span>}
    </div>
  )
}
