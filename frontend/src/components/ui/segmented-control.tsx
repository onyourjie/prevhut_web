import { cn } from '@/lib/utils'

export interface SegmentOption<T extends string = string> {
  value: T
  label: string
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
  ariaLabel?: string
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  className,
  ariaLabel = 'Pilihan filter',
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center p-1 bg-neutral-50 rounded-[var(--radius-sm)] border border-neutral-200 w-full',
        className,
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex-1 inline-flex items-center justify-center min-h-[44px] px-3 py-2 rounded-[calc(var(--radius-sm)-2px)]',
              'text-xs font-semibold select-none cursor-pointer transition-colors duration-150 focus-ring',
              isSelected
                ? 'bg-brand-700 text-white shadow-xs'
                : 'text-neutral-700 hover:text-neutral-1000 hover:bg-neutral-100',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
