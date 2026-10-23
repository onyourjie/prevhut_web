import React from 'react'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'long'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  isLoading?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-800 disabled:bg-neutral-300 disabled:text-white disabled:cursor-not-allowed',
  secondary:
    'bg-accent-900 text-white hover:bg-accent-950 active:bg-accent-950 disabled:bg-neutral-300 disabled:text-white disabled:cursor-not-allowed',
  danger:
    'bg-error-600 text-white hover:bg-error-700 active:bg-error-700 disabled:bg-neutral-300 disabled:text-white disabled:cursor-not-allowed',
  outline:
    'border border-brand-700 text-brand-700 bg-transparent hover:bg-brand-50 hover:text-brand-800 active:bg-brand-50 active:text-brand-800 disabled:border-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'min-h-[44px] min-w-[44px] px-3 py-2 text-xs font-semibold rounded-[var(--radius-sm)]',
  md: 'min-h-[44px] min-w-[44px] px-4 py-2.5 text-sm font-semibold rounded-[var(--radius-sm)]',
  lg: 'min-h-[48px] min-w-[48px] px-6 py-3 text-base font-semibold rounded-[var(--radius-sm)]',
  long: 'w-full min-h-[44px] px-4 py-3 text-base font-semibold rounded-[var(--radius-sm)]',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      isLoading = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 select-none cursor-pointer',
          'transition-colors duration-150 focus-ring',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block text-xs font-medium">Memuat...</span>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0 items-center">{leftIcon}</span>}
            {children && <span>{children}</span>}
            {rightIcon && <span className="inline-flex shrink-0 items-center">{rightIcon}</span>}
          </>
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'
