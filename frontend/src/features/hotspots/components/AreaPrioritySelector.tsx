import { Flame, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PriorityLevel } from '../schemas'

interface AreaPrioritySelectorProps {
  selectedPriorities: PriorityLevel[]
  onTogglePriority: (priority: PriorityLevel) => void
}

const PRIORITY_OPTIONS: {
  level: PriorityLevel
  label: string
  borderColor: string
  activeBg: string
  activeText: string
  checkBorder: string
  checkBg: string
  dotColor: string
}[] = [
  {
    level: 'P1',
    label: 'Prioritas Tinggi',
    borderColor: 'border-error-300',
    activeBg: 'bg-error-50/70',
    activeText: 'text-error-900',
    checkBorder: 'border-error-600',
    checkBg: 'bg-error-600',
    dotColor: 'bg-error-600',
  },
  {
    level: 'P2',
    label: 'Perhatian Meningkat',
    borderColor: 'border-warning-300',
    activeBg: 'bg-warning-50/70',
    activeText: 'text-warning-950',
    checkBorder: 'border-warning-600',
    checkBg: 'bg-warning-600',
    dotColor: 'bg-warning-600',
  },
  {
    level: 'P3',
    label: 'Tetap Dipantau',
    borderColor: 'border-purple-300',
    activeBg: 'bg-purple-50/70',
    activeText: 'text-purple-950',
    checkBorder: 'border-purple-600',
    checkBg: 'bg-purple-600',
    dotColor: 'bg-purple-600',
  },
]

export function AreaPrioritySelector({
  selectedPriorities,
  onTogglePriority,
}: AreaPrioritySelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
        <Flame className="w-4 h-4" />
        <span>Tingkat Prioritas</span>
      </div>

      <div className="flex flex-col gap-2">
        {PRIORITY_OPTIONS.map((opt) => {
          const isSelected = selectedPriorities.includes(opt.level)
          return (
            <button
              key={opt.level}
              type="button"
              onClick={() => onTogglePriority(opt.level)}
              aria-pressed={isSelected}
              className={cn(
                'w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer focus-ring',
                isSelected
                  ? `${opt.borderColor} ${opt.activeBg} ${opt.activeText}`
                  : 'border-neutral-200 bg-white text-neutral-500 opacity-60'
              )}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                    isSelected
                      ? `${opt.checkBorder} ${opt.checkBg} text-white`
                      : 'border-neutral-300 bg-white'
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="font-bold">{opt.level}</span>
                <span>-</span>
                <span>{opt.label}</span>
              </div>
              <span className={cn('w-2.5 h-2.5 rounded-full', opt.dotColor)} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
