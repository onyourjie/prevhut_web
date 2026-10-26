import { useState, useMemo } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ShieldAlert,
  AlertTriangle,
  Search,
  RefreshCw,
  Flame,
  ShieldCheck,
  UserX,
} from 'lucide-react'
import { AppLayout } from '@/components/layout/app-layout'
import { useAuthStore } from '@/store/auth.store'
import { apiRequest } from '@/lib/api'
import { cn } from '@/lib/utils'
import { FirezoneSwal, showSuccessToast, showErrorToast } from '@/lib/swal'
import { MediaLightboxModal } from '@/components/community/media-lightbox-modal'
import { KALIMANTAN_PROVINCES } from '@/lib/kalimantan-locations'
import {
  ModerationPostCard,
  type ReportedPost,
} from '@/components/moderation/ModerationPostCard'

export const Route = createFileRoute('/moderation')({
  component: ModerationPage,
})

export interface ModerationStats {
  totalReports: number
  pendingReports: number
  resolvedReports: number
  reportedPostsCount: number
}

function ModerationPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, isAuthenticated } = useAuthStore()

  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'resolved'>('pending')
  const [selectedKabupaten, setSelectedKabupaten] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [lightboxMedia, setLightboxMedia] = useState<{
    url: string
    authorName?: string
    address?: string
    category?: 'DARURAT' | 'INFORMASI'
  } | null>(null)
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  // 1. Fetch Stats
  const { data: stats } = useQuery<ModerationStats>({
    queryKey: ['moderation-stats'],
    queryFn: () => apiRequest<ModerationStats>('/community/reports/stats'),
    enabled: isAuthenticated && user?.role === 'ADMIN',
  })

  // 2. Fetch Reported Posts
  const {
    data: reportedPosts = [],
    isLoading,
  } = useQuery<ReportedPost[]>({
    queryKey: ['moderation-posts', activeTab, selectedKabupaten, searchTerm],
    queryFn: () => {
      const params = new URLSearchParams()
      if (activeTab !== 'all') params.append('status', activeTab)
      if (selectedKabupaten) params.append('kabupaten', selectedKabupaten)
      if (searchTerm.trim()) params.append('search', searchTerm.trim())
      return apiRequest<ReportedPost[]>(`/community/reports?${params.toString()}`)
    },
    enabled: isAuthenticated && user?.role === 'ADMIN',
  })

  // All Kalimantan Regencies for Filter
  const allKabupatens = useMemo(() => {
    return KALIMANTAN_PROVINCES.flatMap((p) => p.regencies.map((r) => r.name)).sort()
  }, [])

  // Handle Moderation Action
  const handleModerate = async (
    postId: string,
    action: 'REJECT_HOAX' | 'APPROVE_VALID' | 'DELETE_POST',
    _postTitle: string
  ) => {
    let confirmTitle = ''
    let confirmText = ''
    let confirmBtnText = ''
    let confirmBtnColor = '#eb5314'

    if (action === 'REJECT_HOAX') {
      confirmTitle = 'Tolak Postingan Sebagai Data Palsu / Hoax?'
      confirmText =
        'Status postingan akan diubah menjadi DITOLAK. Kontribusi skor konfirmasi warga pada klaster titik api otomatis dikembalikan ke 0 poin.'
      confirmBtnText = 'Ya, Tolak Postingan'
      confirmBtnColor = '#dc2626'
    } else if (action === 'APPROVE_VALID') {
      confirmTitle = 'Nyatakan Postingan Sah & Valid?'
      confirmText =
        'Seluruh aduan warga terkait postingan ini akan ditandai telah selesai ditinjau. Postingan tetap aktif seperti biasa.'
      confirmBtnText = 'Ya, Nyatakan Sah'
      confirmBtnColor = '#16a34a'
    } else if (action === 'DELETE_POST') {
      confirmTitle = 'Hapus Postingan Secara Permanen?'
      confirmText =
        'Postingan beserta seluruh foto, komentar, dan riwayat aduan akan dihapus secara permanen dari server.'
      confirmBtnText = 'Hapus Permanen'
      confirmBtnColor = '#b91c1c'
    }

    const confirmRes = await FirezoneSwal.fire({
      icon: action === 'APPROVE_VALID' ? 'question' : 'warning',
      title: confirmTitle,
      text: confirmText,
      showCancelButton: true,
      confirmButtonText: confirmBtnText,
      cancelButtonText: 'Batal',
      confirmButtonColor: confirmBtnColor,
    })

    if (!confirmRes.isConfirmed) return

    try {
      setIsProcessing(postId)
      const res = await apiRequest<{ message: string; success: boolean }>(
        `/community/posts/${postId}/moderate`,
        {
          method: 'POST',
          body: JSON.stringify({ action }),
        }
      )

      showSuccessToast(res.message || 'Tindakan moderasi berhasil diterapkan.')
      queryClient.invalidateQueries({ queryKey: ['moderation-posts'] })
      queryClient.invalidateQueries({ queryKey: ['moderation-stats'] })
      queryClient.invalidateQueries({ queryKey: ['hotspot-priority-areas'] })
    } catch (err: any) {
      showErrorToast(err?.message || 'Gagal memproses tindakan moderasi.')
    } finally {
      setIsProcessing(null)
    }
  }

  // Access Guard
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <AppLayout title="Moderasi Konten" subtitle="Akses Terbatas Admin Posko">
        <div className="py-16 text-center max-w-md mx-auto bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <UserX className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-neutral-900">Akses Terbatas</h2>
            <p className="text-xs text-neutral-500 mt-1">
              Halaman ini khusus diperuntukkan bagi <strong>Koordinator Posko BPBD (Admin)</strong> untuk mengelola aduan dan moderasi laporan warga.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: '/' })}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition"
          >
            Kembali ke Beranda
          </button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout
      title="Moderasi Konten"
      subtitle="Tinjau aduan warga & verifikasi postingan dugaan hoax atau data palsu"
    >
      <div className="space-y-5 max-w-5xl mx-auto text-left">
        {/* Header Title & Description */}
        <div className="bg-gradient-to-r from-rose-500/10 via-orange-500/5 to-transparent p-4 sm:p-5 rounded-2xl border border-rose-200/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-sm shadow-rose-600/30 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-neutral-900 leading-tight">
                Pusat Moderasi & Aduan Konten
              </h1>
              <p className="text-xs text-neutral-600 mt-0.5">
                Pantau laporan warga terhadap postingan karhutla palsu. Menolak postingan palsu otomatis mengembalikan skor konfirmasi warga ke <strong>0 poin</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-rose-200/90 shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                Perlu Tindakan
              </span>
              <span className="text-xl font-black text-rose-600 leading-none">
                {stats?.pendingReports ?? 0}
              </span>
              <span className="text-[11px] text-neutral-400 font-medium ml-1">aduan aktif</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-black">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                Postingan Diadukan
              </span>
              <span className="text-xl font-black text-neutral-900 leading-none">
                {stats?.reportedPostsCount ?? 0}
              </span>
              <span className="text-[11px] text-neutral-400 font-medium ml-1">unggahan</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                Aduan Terselesaikan
              </span>
              <span className="text-xl font-black text-emerald-700 leading-none">
                {stats?.resolvedReports ?? 0}
              </span>
              <span className="text-[11px] text-neutral-400 font-medium ml-1">kasus ditangani</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-neutral-200 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Status Tabs */}
            <div className="inline-flex p-1 bg-neutral-100 rounded-xl gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('pending')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
                  activeTab === 'pending'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                )}
              >
                Perlu Ditinjau ({stats?.pendingReports ?? 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
                  activeTab === 'all'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                )}
              >
                Semua ({stats?.totalReports ?? 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('resolved')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
                  activeTab === 'resolved'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                )}
              >
                Selesai ({stats?.resolvedReports ?? 0})
              </button>
            </div>

            {/* Regency Filter Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={selectedKabupaten}
                onChange={(e) => setSelectedKabupaten(e.target.value)}
                className="text-xs py-2 px-3 rounded-xl border border-neutral-200 bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              >
                <option value="">Semua Wilayah Kabupaten</option>
                {allKabupatens.map((kab) => (
                  <option key={kab} value={kab}>
                    {kab}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kata kunci isi postingan, alamat, atau nama pelapor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Content List */}
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center text-neutral-400 gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-rose-600" />
            <span className="text-xs font-semibold">Memuat daftar aduan konten...</span>
          </div>
        ) : reportedPosts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-neutral-200 p-8 shadow-xs">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-extrabold text-sm text-neutral-900 mb-1">
              Tidak Ada Aduan Konten
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              {activeTab === 'pending'
                ? 'Semua postingan bersih atau telah selesai ditinjau. Tidak ada laporan dugaan hoax yang tertunda.'
                : 'Tidak ditemukan postingan yang cocok dengan kriteria filter saat ini.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reportedPosts.map((post) => (
              <ModerationPostCard
                key={post.id}
                post={post}
                isProcessing={isProcessing === post.id}
                onModerate={handleModerate}
                onOpenLightbox={setLightboxMedia}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxMedia && (
        <MediaLightboxModal
          isOpen={true}
          mediaUrl={lightboxMedia.url}
          authorName={lightboxMedia.authorName}
          address={lightboxMedia.address}
          category={lightboxMedia.category}
          onClose={() => setLightboxMedia(null)}
        />
      )}
    </AppLayout>
  )
}
