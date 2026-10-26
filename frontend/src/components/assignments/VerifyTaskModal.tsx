import React, { useState, useEffect, useRef } from 'react'
import {
  Camera,
  Video,
  RefreshCw,
  MapPin,
  Upload,
  X,
} from 'lucide-react'
import type { Assignment } from './assignment.types'
import { LiveCameraViewfinder } from '@/components/camera/live-camera-viewfinder'
import { CommunityVideoPlayer } from '@/components/community/community-video-player'
import { isVideoMedia, uploadMediaToCloudinary } from '@/lib/cloudinary'
import { showSuccessToast, showErrorToast } from '@/lib/swal'
import { cn } from '@/lib/utils'

interface VerifyTaskModalProps {
  task: Assignment | null
  photo: string
  lat: number | null
  lon: number | null
  notes: string
  isUploading?: boolean
  isDetectingGps?: boolean
  isSubmitting: boolean
  onPhotoChange: (url: string) => void
  onLatChange: (lat: number | null) => void
  onLonChange: (lon: number | null) => void
  onNotesChange: (notes: string) => void
  onDetectGps?: () => void
  onFileUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export function VerifyTaskModal({
  task,
  photo,
  lat,
  lon,
  notes,
  isUploading = false,
  isDetectingGps = false,
  isSubmitting,
  onPhotoChange,
  onLatChange,
  onLonChange,
  onNotesChange,
  onDetectGps,
  onFileUpload: _onFileUpload,
  onClose,
  onSubmit,
}: VerifyTaskModalProps) {
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isLocalUploading, setIsLocalUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Otomatis sinkronkan koordinat dari pin area terdampak laporan jika belum ada
  useEffect(() => {
    if (task) {
      if (lat == null && task.post?.latitude != null) {
        onLatChange(task.post.latitude)
      }
      if (lon == null && task.post?.longitude != null) {
        onLonChange(task.post.longitude)
      }
    }
  }, [task, lat, lon, onLatChange, onLonChange])

  if (!task) return null

  // Titik koordinat aktif (default ke koordinat laporan jika lat/lon belum di-set)
  const activeLat = lat ?? task.post?.latitude ?? null
  const activeLon = lon ?? task.post?.longitude ?? null
  const isVideo = isVideoMedia(photo)
  const uploading = isLocalUploading || isUploading

  // Tangani upload media (foto atau video) baik dari kamera langsung maupun galeri
  const handleProcessMediaFile = async (file: File) => {
    try {
      setIsLocalUploading(true)
      const url = await uploadMediaToCloudinary(file, 'firezone_verifications')
      onPhotoChange(url)
      setIsCameraOpen(false)
      const typeText = file.type.startsWith('video/') ? 'Video' : 'Foto'
      showSuccessToast(`${typeText} bukti verifikasi lapangan berhasil diunggah!`)
    } catch (err: any) {
      showErrorToast(err.message || 'Gagal mengunggah media verifikasi')
    } finally {
      setIsLocalUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-4 my-8 text-left">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-neutral-900 leading-tight">
                Verifikasi Lapangan & Selesaikan Tugas
              </h3>
              <p className="text-xs text-neutral-500">
                {task.clusterCode || 'Lokasi Sasaran'} • Disposisi Posko BPBD
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* 1. Foto / Video Bukti Pemadaman */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-neutral-800">
                1. Bukti Foto / Video Pemadaman Lapangan <span className="text-red-500">*</span>
              </label>
              {!isCameraOpen && !photo && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-neutral-700 hover:text-neutral-900 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Pilih dari Galeri</span>
                </button>
              )}
            </div>

            {/* A. Viewfinder Kamera Langsung (Bisa Foto / Rekam Video 30s) */}
            {isCameraOpen ? (
              <div className="rounded-2xl overflow-hidden border border-neutral-300">
                <LiveCameraViewfinder
                  onCapture={handleProcessMediaFile}
                  onClose={() => setIsCameraOpen(false)}
                  isUploading={uploading}
                />
              </div>
            ) : photo ? (
              /* B. Tampilan Media yang Sudah Diunggah (Foto atau Video) */
              <div className="relative rounded-2xl overflow-hidden border border-neutral-300 bg-neutral-950 aspect-video flex items-center justify-center shadow-xs group">
                {isVideo ? (
                  <CommunityVideoPlayer
                    src={photo}
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <img
                    src={photo}
                    alt="Bukti Verifikasi Pemadaman"
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Badge Format Media */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-black/70 text-white backdrop-blur-xs flex items-center gap-1 border border-white/20">
                    {isVideo ? <Video className="w-3 h-3 text-red-400" /> : <Camera className="w-3 h-3 text-emerald-400" />}
                    <span>{isVideo ? 'Video Terunggah' : 'Foto Terunggah'}</span>
                  </span>
                </div>

                {/* Tombol Aksi Media */}
                <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-black/75 hover:bg-black text-white text-[10px] font-bold backdrop-blur-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Ambil Ulang</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onPhotoChange('')}
                    className="px-2 py-1 rounded-lg bg-red-600/80 hover:bg-red-700 text-white text-[10px] font-bold backdrop-blur-xs transition cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ) : (
              /* C. Pilihan Ambil Media: Kamera Langsung atau File */
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  disabled={uploading}
                  className="w-full py-4 px-4 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/80 transition flex flex-col items-center justify-center gap-1.5 cursor-pointer group shadow-2xs"
                >
                  {uploading ? (
                    <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-700 group-hover:scale-105 transition">
                      <Camera className="w-5 h-5 stroke-[2.2]" />
                      <span className="text-xs text-neutral-400 font-bold">/</span>
                      <Video className="w-5 h-5 stroke-[2.2]" />
                    </div>
                  )}
                  <span className="text-xs font-black text-emerald-950">
                    {uploading ? 'Sedang Mengunggah Media...' : 'Buka Kamera / Perekam Lapangan'}
                  </span>
                  <span className="text-[10px] text-emerald-800/80">
                    Jepret foto langsung atau rekam video singkat kondisi pemadaman
                  </span>
                </button>
              </div>
            )}

            {/* Hidden Input untuk Upload Galeri */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleProcessMediaFile(file)
              }}
              className="hidden"
            />
          </div>

          {/* 2. Lokasi Verifikasi Lapangan (Sesuai Area Terdampak) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>2. Lokasi Verifikasi Lapangan:</span>
              </label>

              {onDetectGps && (
                <button
                  type="button"
                  onClick={onDetectGps}
                  disabled={isDetectingGps}
                  className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <RefreshCw className={cn("w-3 h-3", isDetectingGps && "animate-spin text-emerald-600")} />
                  <span>{isDetectingGps ? 'Mendeteksi GPS...' : 'Deteksi GPS Lapangan'}</span>
                </button>
              )}
            </div>

            {/* Pin Lokasi Visual Card */}
            <div className="p-3.5 rounded-2xl bg-neutral-50/90 border border-neutral-200/90 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <h4 className="text-xs font-black text-neutral-900 truncate">
                  {task.clusterCode || task.post?.address || 'Titik Sasaran Pemadaman'}
                </h4>
                {task.post?.address && (
                  <p className="text-[11px] text-neutral-600 line-clamp-2 leading-tight">
                    {task.post.address}
                  </p>
                )}
                <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                  <span className="text-[10px] font-mono text-neutral-600 bg-white px-2 py-0.5 rounded-md border border-neutral-200">
                    Koordinat:{' '}
                    {activeLat != null && activeLon != null
                      ? `${Number(activeLat).toFixed(5)}, ${Number(activeLon).toFixed(5)}`
                      : 'Belum tersedia'}
                  </span>

                  {activeLat == null || activeLon == null ? (
                    <span className="text-[10px] text-amber-600 font-medium">
                      *Klik "Deteksi GPS Lapangan" di atas
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Catatan Ringkas Penanganan */}
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

          {/* Tombol Submit */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !photo || uploading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center gap-2 shadow-md shadow-emerald-600/25 cursor-pointer disabled:opacity-50"
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
