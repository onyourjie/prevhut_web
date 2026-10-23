import React from 'react'
import { cn } from '@/lib/utils'

export type ChipSize = 'md' | 'lg'

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  size?: ChipSize
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      children,
      className,
      selected = false,
      size = 'md',
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        role="button"
        aria-pressed={selected}
        disabled={disabled}
        className={cn(
          // 44px touch target area per DESIGN.md 6.4
          'inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-[var(--radius-full)] select-none cursor-pointer',
          'text-xs font-semibold transition-colors duration-150 focus-ring',
          size === 'lg' ? 'text-sm px-4' : 'text-xs px-3',
          selected
            ? 'bg-brand-700 text-white hover:bg-brand-800'
            : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
        {...props}
      >
        {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    )
  },
)

Chip.displayName = 'Chip'
