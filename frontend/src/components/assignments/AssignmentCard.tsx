import { Link } from '@tanstack/react-router'
import {
  MapPin,
  ExternalLink,
  Clock,
  UserCheck,
  CheckCircle2,
  XCircle,
  Truck,
  Check,
  RefreshCw,
} from 'lucide-react'
import type { Assignment } from './assignment.types'

interface AssignmentCardProps {
  task: Assignment
  updatingTaskId: string | null
  onAccept: (id: string) => void
  onStartTrip: (id: string) => void
  onArrive: (id: string) => void
  onOpenReject: (task: Assignment) => void
  onOpenVerify: (task: Assignment) => void
}

export function AssignmentCard({
  task,
  updatingTaskId,
  onAccept,
  onStartTrip,
  onArrive,
  onOpenReject,
  onOpenVerify,
}: AssignmentCardProps) {
  const isUpdating = updatingTaskId === task.id

  return (
    <div
      className={`p-5 rounded-2xl bg-white border transition shadow-xs space-y-4 ${
        task.priorityLevel === 'P1'
          ? 'border-red-200 hover:border-red-400'
          : 'border-neutral-200 hover:border-neutral-300'
      }`}
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
              task.priorityLevel === 'P1'
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}
          >
            {task.priorityLevel === 'P1'
              ? 'P1 • Prioritas Tinggi'
              : 'P2 • Perhatian Meningkat'}
          </span>

          {task.clusterCode && (
            <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-neutral-100 text-neutral-800">
              {task.clusterCode}
            </span>
          )}
        </div>

        {/* Status Badge */}
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            task.status === 'ASSIGNED'
              ? 'bg-amber-100 text-amber-800 border border-amber-200'
              : task.status === 'ACCEPTED' || task.status === 'ON_THE_WAY'
              ? 'bg-blue-100 text-blue-800 border border-blue-200'
              : task.status === 'ON_SITE'
              ? 'bg-purple-100 text-purple-800 border border-purple-200'
              : task.status === 'COMPLETED'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
          }`}
        >
          {task.status === 'ASSIGNED' && 'Menunggu Respon'}
          {task.status === 'ACCEPTED' && 'Diterima Relawan'}
          {task.status === 'ON_THE_WAY' && 'Sedang Meluncur ke Lokasi'}
          {task.status === 'ON_SITE' && 'Tiba di Lokasi Kejadian'}
          {task.status === 'COMPLETED' && 'Verifikasi Selesai'}
          {task.status === 'REJECTED' && 'Penugasan Ditolak'}
        </span>
      </div>

      {/* Target Address & Dispatcher Info */}
      <div className="space-y-2">
        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-sm text-neutral-900 leading-snug">
              {task.post?.address || task.clusterCode || 'Lokasi Titik Pantau'}
            </h4>
            {task.notes && (
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                <span className="font-bold text-neutral-800">Instruksi Posko: </span>
                {task.notes}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 pt-1">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>Ditugaskan: {new Date(task.createdAt).toLocaleString('id-ID')}</span>
          </div>

          {task.admin && (
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-neutral-400" />
              <span>Petugas Posko: {task.admin.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Linked Citizen Report Card if available */}
      {task.post && (
        <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-[11px] font-extrabold text-orange-900 uppercase">
                Terkait Laporan Warga
              </span>
            </div>
            <p className="text-xs text-orange-950 font-medium line-clamp-2">
              &quot;{task.post.content}&quot;
            </p>
          </div>
          {task.post.imageUrl && (
            <img
              src={task.post.imageUrl}
              alt="Bukti warga"
              className="w-12 h-12 rounded-lg object-cover shrink-0 border border-orange-200"
            />
          )}
        </div>
      )}

      {/* Verification Result if COMPLETED */}
      {task.status === 'COMPLETED' && (
        <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
          <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Bukti Penanganan Terverifikasi Lapangan</span>
          </div>
          {task.verificationPhoto && (
            <img
              src={task.verificationPhoto}
              alt="Verifikasi foto"
              className="w-full h-36 object-cover rounded-xl border border-emerald-200"
            />
          )}
          {task.verificationGpsLat && (
            <p className="text-[11px] text-emerald-800 font-mono">
              GPS Koordinat: {task.verificationGpsLat.toFixed(5)},{' '}
              {task.verificationGpsLon?.toFixed(5)}
            </p>
          )}
          {task.completedAt && (
            <p className="text-[10px] text-emerald-700">
              Selesai pada: {new Date(task.completedAt).toLocaleString('id-ID')}
            </p>
          )}
        </div>
      )}

      {/* Rejection reason if REJECTED */}
      {task.status === 'REJECTED' && task.rejectionReason && (
        <div className="p-3 rounded-xl bg-neutral-100 text-neutral-700 text-xs flex items-start gap-2">
          <XCircle className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Alasan Penolakan: </span>
            <span>{task.rejectionReason}</span>
          </div>
        </div>
      )}

      {/* Progress State Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100">
        {/* External Map Action */}
        {task.post?.latitude ? (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${task.post.latitude},${task.post.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50/80 border border-brand-200/60 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Petunjuk Arah Maps</span>
          </a>
        ) : (
          <Link
            to="/map"
            className="text-xs font-bold text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 transition"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Cek Peta Sebaran</span>
          </Link>
        )}

        {/* Main Action Buttons */}
        <div className="flex items-center gap-2">
          {task.status === 'ASSIGNED' && (
            <>
              <button
                type="button"
                onClick={() => onOpenReject(task)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition cursor-pointer"
              >
                Tolak
              </button>
              <button
                type="button"
                onClick={() => onAccept(task.id)}
                disabled={isUpdating}
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                {isUpdating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>Terima Tugas</span>
              </button>
            </>
          )}

          {task.status === 'ACCEPTED' && (
            <button
              type="button"
              onClick={() => onStartTrip(task.id)}
              disabled={isUpdating}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {isUpdating ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Truck className="w-3.5 h-3.5" />
              )}
              <span>Mulai Berangkat (On The Way)</span>
            </button>
          )}

          {task.status === 'ON_THE_WAY' && (
            <button
              type="button"
              onClick={() => onArrive(task.id)}
              disabled={isUpdating}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {isUpdating ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <MapPin className="w-3.5 h-3.5" />
              )}
              <span>Tiba di Lokasi (On Site)</span>
            </button>
          )}

          {task.status === 'ON_SITE' && (
            <button
              type="button"
              onClick={() => onOpenVerify(task)}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verifikasi & Selesaikan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
