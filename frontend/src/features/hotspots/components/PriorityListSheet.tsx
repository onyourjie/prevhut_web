import { Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PriorityArea } from '../schemas'
import { AreaPriorityCard } from './AreaPriorityCard'

export interface PriorityListSheetProps {
  areas: PriorityArea[]
  regencyName?: string
  isOpen: boolean
  onClose: () => void
  onSelectArea: (area: PriorityArea) => void
  className?: string
}

export function PriorityListSheet({
  areas,
  regencyName = 'Kab. Sintang',
  isOpen,
  onClose,
  onSelectArea,
  className,
}: PriorityListSheetProps) {
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
        aria-label={`Daftar ${areas.length} Area Prioritas di ${regencyName}`}
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl border-t border-neutral-200/90 max-w-lg mx-auto max-h-[88vh] flex flex-col animate-in slide-in-from-bottom duration-250 select-none pointer-events-auto',
          className,
        )}
      >
        <div className="pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-neutral-300" />
        </div>

        <div className="px-5 pb-6 overflow-y-auto no-scrollbar flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3 pt-1">
            <div className="flex flex-col">
              <h2 className="text-xl font-extrabold text-neutral-1000 tracking-tight">
                {areas.length} Area Prioritas di {regencyName}
              </h2>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Menampilkan titik area prioritas, diurutkan berdasarkan tingkat risiko.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup daftar area prioritas"
              className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition focus-ring cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs font-semibold text-amber-950">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Titik panas belum berarti kebakaran terkonfirmasi</span>
          </div>

          <div className="flex flex-col gap-3">
            {areas.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-500">
                Tidak ada area prioritas yang cocok dengan filter aktif.
              </div>
            ) : (
              areas.map((area) => (
                <AreaPriorityCard
                  key={area.id}
                  area={area}
                  onSelect={(item) => {
                    onSelectArea(item)
                    onClose()
                  }}
                  actionText="Lihat detail"
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
