import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MapFilter } from '../schemas'
import { AreaFilterForm } from './AreaFilterForm'

export interface MapFilterSheetProps {
  isOpen: boolean
  currentFilter: MapFilter
  onApply: (filter: MapFilter) => void
  onClose: () => void
  className?: string
}

export function MapFilterSheet({
  isOpen,
  currentFilter,
  onApply,
  onClose,
  className,
}: MapFilterSheetProps) {
  if (!isOpen) return null

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs transition-opacity animate-in fade-in duration-200 pointer-events-auto"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filter Peta"
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl border-t border-neutral-200/90 max-w-lg mx-auto max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-250 select-none pointer-events-auto',
          className,
        )}
      >
        <div className="pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-neutral-300" />
        </div>

        <div className="px-5 py-2 flex items-center justify-between border-b border-neutral-100 shrink-0">
          <h2 className="text-xl font-extrabold text-neutral-1000 tracking-tight">Filter Peta</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal filter"
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-700 transition focus-ring cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 overflow-y-auto no-scrollbar flex-1">
          <AreaFilterForm
            currentFilter={currentFilter}
            onApply={(filter) => {
              onApply(filter)
              onClose()
            }}
          />
        </div>
      </div>
    </>
  )
}
