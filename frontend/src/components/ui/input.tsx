import { AlertCircle } from "lucide-react";
import React, { useId } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  prefixText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id: customId,
      label,
      hint,
      error,
      prefixText,
      leftIcon,
      rightIcon,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const defaultId = useId()
    const inputId = customId || defaultId
    const hintId = hint ? `${inputId}-hint` : undefined
    const errorId = error ? `${inputId}-error` : undefined

    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-neutral-1000 select-none"
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            'flex items-center w-full min-h-[44px] rounded-[var(--radius-sm)] border bg-white px-3',
            'transition-colors duration-150',
            // Default border & text states per DESIGN.md 6.3
            error
              ? 'border-error-600 focus-within:border-error-700'
              : 'border-neutral-500 focus-within:border-brand-700',
            disabled && 'bg-neutral-50 border-neutral-200 cursor-not-allowed',
            // Focus ring indicator
            'focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-700 focus-within:ring-offset-2',
            error && 'focus-within:ring-error-600',
          )}
        >
          {prefixText && (
            <span className="text-sm font-medium text-neutral-700 select-none mr-2">
              {prefixText}
            </span>
          )}

          {leftIcon && (
            <span className="text-neutral-700 select-none mr-2 shrink-0 flex items-center">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={cn(
              'w-full bg-transparent text-sm text-neutral-1000 placeholder:text-neutral-700',
              'focus:outline-none disabled:text-neutral-500 disabled:cursor-not-allowed',
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <span className="text-neutral-700 select-none ml-2 shrink-0 flex items-center">
              {rightIcon}
            </span>
          )}
        </div>

        {error ? (
          <p id={errorId} className="text-xs font-medium text-error-700 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : hint ? (
          <p id={hintId} className="text-xs text-neutral-700">
            {hint}
          </p>
        ) : null}
      </div>
    )
  },
)

Input.displayName = 'Input'
