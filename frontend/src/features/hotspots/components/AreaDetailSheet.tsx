import { cn } from '@/lib/utils'
import type { PriorityArea } from '../schemas'
import { AreaDetailContent } from './AreaDetailContent'

export interface AreaDetailSheetProps {
  area: PriorityArea
  onBack: () => void
  className?: string
}

/**
 * Kartu rincian mengambang untuk mobile. Tanpa backdrop supaya peta dan kotak area
 * tetap terlihat dan bisa disentuh di atas kartu.
 */
export function AreaDetailSheet({ area, onBack, className }: AreaDetailSheetProps) {
  return (
    <div
      role="dialog"
      aria-label={`Rincian Area Pemantauan ${area.name}`}
      className={cn(
        'fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 max-w-md mx-auto',
        'bg-white/70 backdrop-blur-xl backdrop-saturate-150 rounded-3xl shadow-2xl border border-white/60',
        'max-h-[55dvh] flex flex-col animate-in slide-in-from-bottom duration-250 select-none pointer-events-auto',
        className,
      )}
    >
      <div className="p-4 overflow-y-auto no-scrollbar">
        <AreaDetailContent area={area} onBack={onBack} backLabel="Kembali" variant="compact" />
      </div>
    </div>
  )
}
