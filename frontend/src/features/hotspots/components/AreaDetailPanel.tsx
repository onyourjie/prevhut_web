import { useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PriorityArea } from '../schemas'
import { AreaDetailContent } from './AreaDetailContent'

export interface AreaDetailPanelProps {
  area: PriorityArea
  onClose: () => void
  className?: string
}

export function AreaDetailPanel({ area, onClose, className }: AreaDetailPanelProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <section
      aria-label={`Rincian Area Pemantauan ${area.name}`}
      className={cn(
        'absolute right-4 top-4 bottom-4 z-[450] w-[380px] xl:w-[400px] flex flex-col',
        'bg-white/70 backdrop-blur-xl backdrop-saturate-150 rounded-3xl shadow-2xl border border-white/60',
        'animate-in slide-in-from-right fade-in duration-300 select-none pointer-events-auto',
        className,
      )}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup panel rincian"
        title="Tutup panel (Esc)"
        className="absolute -left-3.5 top-6 z-40 w-7 h-7 bg-white rounded-full shadow-md border border-neutral-300 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition cursor-pointer focus-ring"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col justify-between gap-6">
        <AreaDetailContent area={area} variant="full" />

        <div className="pt-3 border-t border-neutral-200/60 mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[44px] rounded-xl border border-neutral-300/80 bg-white/70 hover:bg-white text-xs font-bold text-neutral-800 hover:text-neutral-950 transition shadow-2xs flex items-center justify-center gap-2 cursor-pointer focus-ring"
          >
            <span>Tutup Rincian</span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500 font-mono border border-neutral-200">
              Esc
            </kbd>
          </button>
        </div>
      </div>
    </section>
  )
}
