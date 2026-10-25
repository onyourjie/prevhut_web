import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import type { Assignment } from './assignment.types'

interface RejectTaskModalProps {
  task: Assignment | null
  reason: string
  isSubmitting: boolean
  onReasonChange: (reason: string) => void
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

const PRESET_REASONS = [
  'Sedang menangani titik api lain',
  'Kekurangan selang / pompa air jinjing',
  'Akses jalan terputus / jarak terlalu jauh',
  'Kondisi fisik kurang fit / sakit',
]

export function RejectTaskModal({
  task,
  reason,
  isSubmitting,
  onReasonChange,
  onClose,
  onSubmit,
}: RejectTaskModalProps) {
  if (!task) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-neutral-900">
              Tolak Penugasan Lapangan
            </h3>
            <p className="text-xs text-neutral-500">
              Admin Posko BPBD akan menerima alasan penolakan untuk pengalihan.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Pilih Alasan Cepat:
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PRESET_REASONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onReasonChange(preset)}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-medium transition cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="Tuliskan alasan penolakan secara jelas..."
              className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-red-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition flex items-center gap-2 shadow-xs cursor-pointer"
            >
              {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>Kirim Penolakan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
