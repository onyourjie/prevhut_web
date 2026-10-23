import { useId } from 'react'
import { cn } from '@/lib/utils'

export interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  disabled?: boolean
  className?: string
  id?: string
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
  id: customId,
}: ToggleProps) {
  const defaultId = useId()
  const toggleId = customId || defaultId
  const descId = description ? `${toggleId}-desc` : undefined

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 py-2 min-h-[44px]',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      <label htmlFor={toggleId} className="flex flex-col cursor-pointer select-none text-left">
        <span className="text-sm font-semibold text-neutral-1000">{label}</span>
        {description && (
          <span id={descId} className="text-xs text-neutral-700">
            {description}
          </span>
        )}
      </label>

      <button
        type="button"
        role="switch"
        id={toggleId}
        aria-checked={checked}
        aria-describedby={descId}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full p-0.5',
          'transition-colors duration-150 focus-ring',
          checked ? 'bg-brand-700' : 'bg-neutral-500',
          disabled && 'cursor-not-allowed',
        )}
      >
        <span className="sr-only">{checked ? 'Aktif' : 'Nonaktif'}</span>
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-xs',
            'transition-transform duration-150',
            checked ? 'translate-x-5' : 'translate-x-0',
          )}
        />
      </button>
    </div>
  )
}
