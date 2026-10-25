import { Link } from '@tanstack/react-router'
import { Truck, MapPin, Clock, ChevronRight, CheckCircle2 } from 'lucide-react'

export interface ActiveTask {
  id: string
  reportId: string
  title: string
  locationName: string
  urgency: string
  status: string
  assignedAt: string
}

interface VolunteerActiveTaskCardProps {
  activeTask: ActiveTask | null
}

export function VolunteerActiveTaskCard({ activeTask }: VolunteerActiveTaskCardProps) {
  if (activeTask) {
    return (
      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-white to-amber-50 border-2 border-amber-400 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
              Tugas Lapangan Berjalan
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 font-extrabold text-[10px]">
            {activeTask.urgency}
          </span>
        </div>

        <div>
          <h4 className="font-extrabold text-sm text-neutral-900 leading-snug">
            {activeTask.title}
          </h4>
          <div className="flex items-center gap-3 text-xs text-neutral-600 mt-1.5">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span className="truncate max-w-[180px]">{activeTask.locationName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>{activeTask.assignedAt}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1 border-t border-amber-200/60">
          <Link
            to="/assignments"
            className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs"
          >
            <Truck className="w-4 h-4 text-amber-400" />
            <span>Buka Lembar Penugasan</span>
          </Link>
          <Link
            to="/map"
            className="text-xs font-bold text-neutral-700 hover:text-neutral-900 flex items-center gap-1"
          >
            <span>Cek Rute Peta</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-2xs flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-xs text-emerald-950">
            Semua Penugasan Selesai
          </h4>
          <p className="text-[11px] text-emerald-700 mt-0.5">
            Belum ada tugas darurat baru. Pantau area prioritas di bawah.
          </p>
        </div>
      </div>
      <Link
        to="/assignments"
        className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
      >
        <span>Riwayat</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  )
}
