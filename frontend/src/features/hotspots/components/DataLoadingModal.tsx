import type { MapFilter } from "../schemas"

export interface DataLoadingModalProps {
  isOpen: boolean
  filter?: MapFilter
  locationName?: string
  totalAreasFound?: number
  onDismiss?: () => void
}

export function DataLoadingModal({ isOpen }: DataLoadingModalProps) {
  if (!isOpen) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/20 backdrop-blur-2xs select-none animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-xl py-3.5 px-6 shadow-md border border-neutral-200 flex items-center gap-3 animate-in zoom-in-95 duration-150">
        <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-700 rounded-full animate-spin shrink-0" />
        <span className="text-sm font-medium text-neutral-800 tracking-tight">
          Sedang mengambil data...
        </span>
      </div>
    </div>
  )
}
