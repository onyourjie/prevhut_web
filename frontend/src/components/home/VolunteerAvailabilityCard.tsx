import { Activity, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react'

interface VolunteerAvailabilityCardProps {
  isAvailable: boolean
  isTogglingAvailability: boolean
  onToggle: () => void
}

export function VolunteerAvailabilityCard({
  isAvailable,
  isTogglingAvailability,
  onToggle,
}: VolunteerAvailabilityCardProps) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-neutral-900">
              Kesiapsiagaan Relawan
            </h4>
            <p className="text-[11px] text-neutral-400">
              Status kesiapan merespon disposisi tugas
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          disabled={isTogglingAvailability}
          className={`px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
            isAvailable
              ? 'bg-emerald-500 text-white shadow-xs hover:bg-emerald-600'
              : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
          }`}
        >
          {isTogglingAvailability ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : isAvailable ? (
            <ShieldCheck className="w-3.5 h-3.5" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5" />
          )}
          <span>{isAvailable ? 'Siap Bertugas' : 'Istirahat / Non-Aktif'}</span>
        </button>
      </div>

      <div className="text-[11px] text-neutral-500 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 flex items-center justify-between">
        <span>
          {isAvailable
            ? 'Lokasi Anda terdaftar aktif untuk menerima disposisi tugas darurat terdekat.'
            : 'Anda sedang dalam mode istirahat. Sistem tidak akan mengirimkan tugas darurat baru.'}
        </span>
      </div>
    </div>
  )
}
