import { useState, useEffect, useRef } from 'react'
import { X, UserPlus, MapPin, AlertTriangle, Send, RefreshCw, FileText, Lock, SlidersHorizontal } from 'lucide-react'
import { apiRequest } from '@/lib/api'
import { showSuccessToast, showErrorToast } from '@/lib/swal'
import type { VolunteerItem } from './VolunteerDirectoryPanel'

interface CreateAssignmentModalProps {
  isOpen: boolean
  targetVolunteer?: VolunteerItem | null
  targetPost?: any
  volunteersList?: VolunteerItem[]
  onClose: () => void
  onSuccess: () => void
}

const EMPTY_VOLUNTEERS: VolunteerItem[] = []

export function CreateAssignmentModal({
  isOpen,
  targetVolunteer,
  targetPost,
  volunteersList = EMPTY_VOLUNTEERS,
  onClose,
  onSuccess,
}: CreateAssignmentModalProps) {
  const [volunteers, setVolunteers] = useState<VolunteerItem[]>([])
  const [isLoadingVolunteers, setIsLoadingVolunteers] = useState(false)
  const hasFetchedRef = useRef(false)

  // Form states
  const [selectedVolunteerId, setSelectedVolunteerId] = useState('')
  const [clusterCode, setClusterCode] = useState('')
  const [priorityLevel, setPriorityLevel] = useState<'P1' | 'P2' | 'P3'>('P2')
  const [prioritySource, setPrioritySource] = useState<string>('Sistem Scoring AI & Status Darurat')
  const [isLockedByAi, setIsLockedByAi] = useState(false)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1. Tentukan Prioritas Lapangan (Otomatis jika Klaster Satelit Terkonfirmasi, atau Manual Admin Posko untuk Ground Checking Laporan Warga)
  useEffect(() => {
    if (!isOpen) return

    let calculatedPriority: 'P1' | 'P2' | 'P3' = 'P2'
    let sourceText = 'Penetapan Manual Admin Posko'
    let locked = false

    if (targetPost) {
      // Default untuk laporan warga yang belum terkonfirmasi satelit NASA FIRMS
      if (targetPost.category === 'DARURAT') {
        calculatedPriority = 'P2'
        sourceText =
          'Aduan Darurat Warga (Bobot Skoring: +10 Poin / Maks 15 Poin) • Belum terkonfirmasi satelit NASA FIRMS. Penugasan ditujukan untuk Ground Checking (verifikasi titik api langsung di lapangan).'
      } else {
        calculatedPriority = 'P3'
        sourceText =
          'Aduan Informasi Warga (Bobot Skoring: +5 Poin / Maks 15 Poin) • Belum terkonfirmasi satelit NASA FIRMS. Penugasan ditujukan untuk Verifikasi Wilayah.'
      }

      // Jika terhubung ke klaster satelit yang memiliki priority_level
      if (targetPost.cluster?.priority_level) {
        locked = true
        const pStr = String(targetPost.cluster.priority_level).toUpperCase()
        const scoreInfo = targetPost.cluster.risk_score ? `${targetPost.cluster.risk_score} Poin - ` : ''
        if (pStr.startsWith('P1')) {
          calculatedPriority = 'P1'
          sourceText = `Skor Risiko Klaster ${targetPost.clusterCode || ''} (${scoreInfo}P1 Prioritas Tinggi)`
        } else if (pStr.startsWith('P2')) {
          calculatedPriority = 'P2'
          sourceText = `Skor Risiko Klaster ${targetPost.clusterCode || ''} (${scoreInfo}P2 Perhatian Meningkat)`
        } else if (pStr.startsWith('P3')) {
          calculatedPriority = 'P3'
          sourceText = `Skor Risiko Klaster ${targetPost.clusterCode || ''} (${scoreInfo}P3 Waspada Ringan)`
        }
      }
    }

    setPriorityLevel(calculatedPriority)
    setPrioritySource(sourceText)
    setIsLockedByAi(locked)

    // Jika ada clusterCode tapi data cluster belum tersertakan, cek langsung ke API klaster satelit
    if (targetPost?.clusterCode && (!targetPost.cluster || !targetPost.cluster.priority_level)) {
      const clusterId = targetPost.clusterCode.toLowerCase().replace(/\s+/g, '_')
      apiRequest<any>(`/hotspots/clusters/${encodeURIComponent(clusterId)}`)
        .then((cl) => {
          if (cl?.priority_level) {
            setIsLockedByAi(true)
            const pStr = String(cl.priority_level).toUpperCase()
            const scoreInfo = cl.risk_score ? `${cl.risk_score} Poin - ` : ''
            if (pStr.startsWith('P1')) {
              setPriorityLevel('P1')
              setPrioritySource(`Skor Risiko Klaster ${cl.code || cl.name} (${scoreInfo}P1 Prioritas Tinggi)`)
            } else if (pStr.startsWith('P2')) {
              setPriorityLevel('P2')
              setPrioritySource(`Skor Risiko Klaster ${cl.code || cl.name} (${scoreInfo}P2 Perhatian Meningkat)`)
            } else if (pStr.startsWith('P3')) {
              setPriorityLevel('P3')
              setPrioritySource(`Skor Risiko Klaster ${cl.code || cl.name} (${scoreInfo}P3 Waspada Ringan)`)
            }
          }
        })
        .catch(() => {
          // Tetap gunakan prioritas bawaan dan mode manual ground checking
        })
    }
  }, [isOpen, targetPost?.id, targetPost?.category, targetPost?.clusterCode])

  // Helper auto-select volunteer di wilayah yang sama
  const autoSelectBestVolunteer = (list: VolunteerItem[]) => {
    if (!list || list.length === 0) return

    if (targetPost?.kabupaten) {
      const cleanTarget = targetPost.kabupaten.toLowerCase().replace(/^(kabupaten|kota)\s+/, '').trim()
      const match = list.find((v) => {
        const cleanV = (v.kabupaten || '').toLowerCase().replace(/^(kabupaten|kota)\s+/, '').trim()
        return cleanV.length > 0 && (cleanV === cleanTarget || cleanV.includes(cleanTarget) || cleanTarget.includes(cleanV))
      })
      if (match) {
        setSelectedVolunteerId(match.id)
        return
      }
    }

    setSelectedVolunteerId((prev) => prev || list[0].id)
  }

  // 2. Inisialisasi data form & daftar relawan saat modal dibuka (Cegah Infinite Loop)
  useEffect(() => {
    if (!isOpen) {
      hasFetchedRef.current = false
      return
    }

    // Set clusterCode & instruksi default
    if (targetPost) {
      setClusterCode(targetPost.clusterCode || targetPost.address || '')
      if (targetPost.content) {
        const snippet =
          targetPost.content.length > 150
            ? `${targetPost.content.slice(0, 150)}...`
            : targetPost.content
        setNotes(
          `Laporan warga (${targetPost.address || 'lokasi'}): "${snippet}". Segera meluncur untuk penanganan & verifikasi lapangan.`
        )
      } else {
        setNotes('')
      }
    }

    if (targetVolunteer) {
      setSelectedVolunteerId(targetVolunteer.id)
      if (!targetPost && targetVolunteer.kabupaten) {
        setClusterCode(`Titik Api ${targetVolunteer.kabupaten}`)
      }
      return
    }

    // Jika list relawan sudah disediakan dari parent component
    if (volunteersList && volunteersList.length > 0) {
      setVolunteers(volunteersList)
      autoSelectBestVolunteer(volunteersList)
      return
    }

    // Ambil daftar relawan dari backend sekali saja per sesi modal terbuka
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true
      setIsLoadingVolunteers(true)

      apiRequest<VolunteerItem[]>('/users/volunteers')
        .then((res) => {
          const list = res || []
          setVolunteers(list)
          autoSelectBestVolunteer(list)
        })
        .catch(() => {
          showErrorToast('Gagal memuat daftar relawan')
        })
        .finally(() => {
          setIsLoadingVolunteers(false)
        })
    }
  }, [isOpen, targetPost?.id, targetVolunteer?.id])

  if (!isOpen) return null

  const activeVol = volunteers.find((v) => v.id === selectedVolunteerId) || targetVolunteer

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedVolunteerId) {
      showErrorToast('Pilih salah satu relawan lapangan')
      return
    }

    try {
      setIsSubmitting(true)
      await apiRequest('/assignments', {
        method: 'POST',
        body: JSON.stringify({
          volunteerId: selectedVolunteerId,
          postId: targetPost?.id || undefined,
          clusterCode: clusterCode.trim() || undefined,
          priorityLevel,
          notes: notes.trim() || undefined,
        }),
      })

      showSuccessToast(
        activeVol
          ? `Tugas berhasil dikirim ke ${activeVol.name}!`
          : 'Penugasan berhasil dikirim!'
      )
      onSuccess()
      onClose()
    } catch (err: any) {
      showErrorToast(err.message || 'Gagal mengirim penugasan')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden text-left flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm text-neutral-900 leading-tight">
                {targetPost ? 'Disposisi Laporan Warga ke Relawan' : 'Tugaskan Relawan Lapangan'}
              </h3>
              <p className="text-[11px] text-neutral-500">
                {targetPost
                  ? 'Kirimkan regu relawan ke titik laporan darurat warga'
                  : 'Disposisi penanganan karhutla ke relawan siaga wilayah'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Target Post Info Banner if linked */}
          {targetPost && (
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-xs">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span>Terkait Laporan: {targetPost.author?.name || 'Warga'}</span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                  {targetPost.category || 'DARURAT'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-700 font-medium line-clamp-2 leading-relaxed">
                "{targetPost.content}"
              </p>
              <div className="text-[10px] text-neutral-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                <span className="break-words flex-1">{targetPost.address}</span>
              </div>
            </div>
          )}

          {/* Target Volunteer Card Banner */}
          {activeVol ? (
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={
                    activeVol.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
                  }
                  alt={activeVol.name}
                  className="w-10 h-10 rounded-xl object-cover border border-emerald-300 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-xs text-neutral-900 truncate">
                      {activeVol.name}
                    </h4>
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Siaga
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-900 font-medium truncate">
                    {activeVol.kabupaten}, {activeVol.province}
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    Telp: {activeVol.phone}
                  </p>
                </div>
              </div>

              {!targetVolunteer && (
                <button
                  type="button"
                  onClick={() => setSelectedVolunteerId('')}
                  className="text-[11px] font-bold text-emerald-800 underline hover:text-emerald-950 shrink-0 cursor-pointer"
                >
                  Ganti
                </button>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                Pilih Relawan ({volunteers.length} Siap Tugas)
              </label>
              {isLoadingVolunteers ? (
                <div className="p-3 text-xs text-neutral-500 flex items-center gap-2 bg-neutral-50 rounded-xl">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Memuat data relawan...</span>
                </div>
              ) : (
                <select
                  value={selectedVolunteerId}
                  onChange={(e) => setSelectedVolunteerId(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                  required
                >
                  <option value="">-- Pilih Relawan --</option>
                  {volunteers.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} — {v.kabupaten} ({v._count?.volunteerTasks ?? 0} tugas)
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Cluster / Area Code */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>Kode Area Pantauan / Lokasi Sasaran</span>
            </label>
            <input
              type="text"
              value={clusterCode}
              onChange={(e) => setClusterCode(e.target.value)}
              placeholder="Contoh: Area Pantau 02 atau Desa Basarang, Kapuas"
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              required
            />
          </div>

          {/* Priority Level */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Tingkat Prioritas Lapangan</span>
              </label>
              {isLockedByAi ? (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Terkunci (Sistem Scoring AI Satelit)</span>
                </span>
              ) : (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                  <SlidersHorizontal className="w-2.5 h-2.5" />
                  <span>Penetapan Manual Admin Posko (Ground Checking)</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['P1', 'P2', 'P3'] as const).map((p) => {
                const isSelected = priorityLevel === p
                const badgeColor =
                  p === 'P1'
                    ? 'border-red-500 bg-red-50 text-red-700 shadow-xs'
                    : p === 'P2'
                    ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-xs'
                    : 'border-purple-500 bg-purple-50 text-purple-700 shadow-xs'

                return (
                  <button
                    key={p}
                    type="button"
                    disabled={isLockedByAi}
                    onClick={() => {
                      if (!isLockedByAi) {
                        setPriorityLevel(p)
                      }
                    }}
                    aria-disabled={isLockedByAi}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-extrabold flex flex-col items-center gap-0.5 transition-all select-none ${
                      isLockedByAi ? 'cursor-not-allowed' : 'cursor-pointer hover:border-neutral-400'
                    } ${
                      isSelected
                        ? badgeColor + ' ring-2 ring-offset-1 ring-neutral-400 font-black'
                        : isLockedByAi
                        ? 'border-neutral-200/80 bg-neutral-50/60 text-neutral-400 opacity-35'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span>{p}</span>
                      {isSelected && <span className="text-[10px]">✓</span>}
                    </div>
                    <span className="text-[10px] font-medium">
                      {p === 'P1' ? 'Bahaya Tinggi' : p === 'P2' ? 'Siaga' : 'Waspada'}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mt-2 text-[11px] text-neutral-700 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/80 flex items-start gap-1.5 leading-relaxed">
              <span className="font-bold text-neutral-900 shrink-0">
                {isLockedByAi ? 'Skoring Otomatis:' : 'Dasar Penetapan:'}
              </span>
              <span className="font-medium text-neutral-600 break-words flex-1">{prioritySource}</span>
            </div>
          </div>

          {/* Notes / Instructions */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1.5">
              Instruksi Posko BPBD (Opsional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Titik api mendekati permukiman (jarak < 5 km). Segera verifikasi koordinat lapangan dan koordinasi tim pemadam."
              className="w-full text-xs font-medium p-3 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-100 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoadingVolunteers || !selectedVolunteerId}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold transition shadow-md shadow-brand-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Kirim Penugasan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
