import React from 'react'
import { Camera, Navigation, RefreshCw } from 'lucide-react'
import type { Assignment } from './assignment.types'

interface VerifyTaskModalProps {
  task: Assignment | null
  photo: string
  lat: number | null
  lon: number | null
  notes: string
  isUploading: boolean
  isDetectingGps: boolean
  isSubmitting: boolean
  onPhotoChange: (url: string) => void
  onLatChange: (lat: number | null) => void
  onLonChange: (lon: number | null) => void
  onNotesChange: (notes: string) => void
  onDetectGps: () => void
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export function VerifyTaskModal({
  task,
  photo,
  lat,
  lon,
  notes,
  isUploading,
  isDetectingGps,
  isSubmitting,
  onPhotoChange,
  onLatChange,
  onLonChange,
  onNotesChange,
  onDetectGps,
  onFileUpload,
  onClose,
  onSubmit,
}: VerifyTaskModalProps) {
  if (!task) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-4 my-8">
        <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-neutral-900">
              Verifikasi Lapangan & Selesaikan Tugas
            </h3>
            <p className="text-xs text-neutral-500">
              {task.clusterCode || 'Lokasi Penugasan'} • Disposisi Posko BPBD
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Photo Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-neutral-800">
              1. Foto Bukti Pemadaman / Kondisi Terkini:
            </label>

            {photo ? (
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200">
                <img
                  src={photo}
                  alt="Verifikasi foto"
                  className="w-full h-44 object-cover"
                />
                <button
                  type="button"
                  onClick={() => onPhotoChange('')}
                  className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 text-white text-[10px] font-bold hover:bg-black transition cursor-pointer"
                >
                  Ganti Foto
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="border-2 border-dashed border-neutral-300 hover:border-emerald-500 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition bg-neutral-50/50">
                  <Camera className="w-8 h-8 text-neutral-400 mb-1" />
                  <span className="text-xs font-bold text-neutral-800">
                    {isUploading ? 'Sedang Mengunggah...' : 'Pilih / Ambil Foto Lapangan'}
                  </span>
                  <span className="text-[10px] text-neutral-500 mt-0.5">
                    Kamera langsung atau galeri perangkat
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={onFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* GPS Coordinates */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-800">
                2. Koordinat GPS Posisi Verifikasi:
              </label>
              <button
                type="button"
                onClick={onDetectGps}
                disabled={isDetectingGps}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <Navigation className="w-3 h-3" />
                <span>{isDetectingGps ? 'Mendeteksi...' : 'Ambil GPS Sekarang'}</span>
              </button>
            </div>
            {task.post?.latitude != null && task.post?.longitude != null && (
              <p className="text-[10px] text-neutral-500">
                Referensi lokasi laporan: {task.post.latitude}, {task.post.longitude}
              </p>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-neutral-500">Latitude:</span>
                <input
                  type="number"
                  step="any"
                  required
                  value={lat ?? ''}
                  min={-90}
                  max={90}
                  onChange={(e) => onLatChange(e.target.value === '' ? null : e.target.valueAsNumber)}
                  className="w-full px-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-neutral-500">Longitude:</span>
                <input
                  type="number"
                  step="any"
                  required
                  value={lon ?? ''}
                  min={-180}
                  max={180}
                  onChange={(e) => onLonChange(e.target.value === '' ? null : e.target.valueAsNumber)}
                  className="w-full px-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Completion Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800">
              3. Catatan Ringkas Penanganan:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Contoh: Titik api telah dipadamkan regu relawan bersama Damkar & warga. Pendinginan tanah gambut selesai."
              className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
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
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center gap-2 shadow-md shadow-emerald-600/25 cursor-pointer"
            >
              {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>Kirim Verifikasi & Selesaikan Tugas</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
