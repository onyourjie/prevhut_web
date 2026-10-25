interface AssignmentStatsGridProps {
  activeCount: number
  completedCount: number
  rejectedCount: number
  totalCount: number
}

export function AssignmentStatsGrid({
  activeCount,
  completedCount,
  rejectedCount,
  totalCount,
}: AssignmentStatsGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
          Tugas Aktif
        </span>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-black text-amber-600">
            {activeCount}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold">
            Diproses
          </span>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
          Selesai
        </span>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-black text-emerald-600">
            {completedCount}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
            Terverifikasi
          </span>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
          Ditolak
        </span>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-black text-neutral-700">
            {rejectedCount}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 font-bold">
            Eskalasi
          </span>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
          Total Tugas
        </span>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-black text-neutral-900">
            {totalCount}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 font-bold">
            Riwayat
          </span>
        </div>
      </div>
    </div>
  )
}
