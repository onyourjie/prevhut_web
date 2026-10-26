import { UserCheck, Shield, RefreshCw, Radio } from 'lucide-react'

interface AssignmentAvailabilityBannerProps {
  userName?: string
  role?: string
  isAvailable: boolean
  isTogglingAvailability: boolean
  onToggle: () => void
}

export function AssignmentAvailabilityBanner({
  userName,
  role,
  isAvailable,
  isTogglingAvailability,
  onToggle,
}: AssignmentAvailabilityBannerProps) {
  const isAdmin = role === 'ADMIN'

  if (isAdmin) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs bg-brand-50 text-brand-600 border border-brand-200">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-neutral-900">
                {userName}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-100 text-brand-800 border border-brand-200">
                Admin Posko BPBD
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Pusat Komando & Disposisi Relawan Lapangan se-Kalimantan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-100/80 border border-neutral-200 text-xs font-bold text-neutral-700 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Posko Siaga Aktif</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
            isAvailable
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
          }`}
        >
          {isAvailable ? <UserCheck className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm text-neutral-900">
              {userName}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
              Relawan Terverifikasi
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            {isAvailable
              ? 'Status: Siap Siaga Bertugas (Available menerima penugasan Posko)'
              : 'Status: Sedang Istirahat / Off Duty (Tidak menerima penugasan baru)'}
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled={isTogglingAvailability}
        onClick={onToggle}
        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs shrink-0 cursor-pointer ${
          isAvailable
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
            : 'bg-neutral-800 hover:bg-neutral-900 text-white'
        }`}
      >
        {isTogglingAvailability ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <span
            className={`w-2 h-2 rounded-full ${
              isAvailable ? 'bg-white animate-pulse' : 'bg-neutral-400'
            }`}
          />
        )}
        <span>{isAvailable ? 'Status: Siap Siaga' : 'Ubah ke Siap Siaga'}</span>
      </button>
    </div>
  )
}
