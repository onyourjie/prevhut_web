import { AlertCircle } from "lucide-react";
import React, { useId } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ id: customId, label, hint, error, className, disabled, rows = 3, ...props }, ref) => {
    const defaultId = useId()
    const inputId = customId || defaultId
    const hintId = hint ? `${inputId}-hint` : undefined
    const errorId = error ? `${inputId}-error` : undefined

    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-neutral-1000 select-none">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            'w-full min-h-[88px] rounded-[var(--radius-sm)] border bg-white p-3 text-sm text-neutral-1000 placeholder:text-neutral-700',
            'transition-colors duration-150',
            error
              ? 'border-error-600 focus:border-error-700 focus:ring-error-600'
              : 'border-neutral-500 focus:border-brand-700 focus:ring-brand-700',
            disabled && 'bg-neutral-50 border-neutral-200 text-neutral-500 cursor-not-allowed',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            className,
          )}
          {...props}
        />

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

Textarea.displayName = 'Textarea'
