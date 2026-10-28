import { useState, useMemo } from 'react'
import {
  Search,
  MapPin,
  Phone,
  UserPlus,
  CheckCircle2,
  X,
  Users,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'

export interface VolunteerItem {
  id: string
  name: string
  phone: string
  avatarUrl?: string | null
  province: string
  kabupaten: string
  kecamatan: string
  latitude?: number | null
  longitude?: number | null
  isAvailable: boolean
  _count?: {
    volunteerTasks: number
  }
}

interface VolunteerDirectoryPanelProps {
  volunteers: VolunteerItem[]
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
  onRetry?: () => void
  onAssignVolunteer: (volunteer: VolunteerItem) => void
  compact?: boolean
}

const PROVINCES = [
  'Semua',
  'Kalimantan Barat',
  'Kalimantan Tengah',
  'Kalimantan Selatan',
  'Kalimantan Timur',
  'Kalimantan Utara',
] as const

const ITEMS_PER_PAGE = 10

export function VolunteerDirectoryPanel({
  volunteers,
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
  onAssignVolunteer,
  compact = false,
}: VolunteerDirectoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProvince, setSelectedProvince] = useState<string>('Semua')
  const [currentPage, setCurrentPage] = useState(1)

  // Filter volunteers
  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((v) => {
      // Province filter
      if (selectedProvince !== 'Semua' && v.province !== selectedProvince) {
        return false
      }

      // Search query (name, kabupaten, kecamatan, phone)
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase().trim()
      const matchName = v.name.toLowerCase().includes(q)
      const matchKab = v.kabupaten.toLowerCase().includes(q)
      const matchKec = v.kecamatan.toLowerCase().includes(q)
      const matchPhone = v.phone.toLowerCase().includes(q)

      return matchName || matchKab || matchKec || matchPhone
    })
  }, [volunteers, searchQuery, selectedProvince])

  // Reset page when filter changes
  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    setCurrentPage(1)
  }

  const handleProvinceChange = (prov: string) => {
    setSelectedProvince(prov)
    setCurrentPage(1)
  }

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredVolunteers.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const paginatedVolunteers = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE
    return filteredVolunteers.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredVolunteers, safeCurrentPage])

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden flex flex-col">
      {/* Panel Header */}
      <div className="p-4 sm:p-5 border-b border-neutral-100 space-y-3 bg-neutral-50/50">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-neutral-900">
                Direktori Relawan Siaga Lapangan
              </h3>
              <p className="text-[11px] text-neutral-500">
                {volunteers.length} relawan terdaftar di 56 Kabupaten/Kota se-Kalimantan
              </p>
            </div>
          </div>
          <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
            {filteredVolunteers.length} Tersedia
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Cari nama relawan atau kabupaten (misal: Sintang, Sambas, Banjar)..."
            className="w-full pl-9 pr-8 py-2 text-xs font-semibold rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white placeholder:text-neutral-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Province Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {PROVINCES.map((prov) => {
            const isSelected = selectedProvince === prov
            const countInProv =
              prov === 'Semua'
                ? volunteers.length
                : volunteers.filter((v) => v.province === prov).length

            const shortLabel =
              prov === 'Semua'
                ? 'Semua'
                : prov === 'Kalimantan Barat'
                ? 'Kalbar'
                : prov === 'Kalimantan Tengah'
                ? 'Kalteng'
                : prov === 'Kalimantan Selatan'
                ? 'Kalsel'
                : prov === 'Kalimantan Timur'
                ? 'Kaltim'
                : 'Kaltara'

            return (
              <button
                key={prov}
                type="button"
                onClick={() => handleProvinceChange(prov)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <span>{shortLabel}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-neutral-700 text-white'
                      : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  {countInProv}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Volunteer List */}
      <div
        className={`divide-y divide-neutral-100 overflow-y-auto ${
          compact ? 'max-h-[540px]' : ''
        }`}
      >
        {isLoading ? (
          <div className="py-16 text-center text-xs text-neutral-400">
            <div className="inline-block w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-2" />
            <p>Memuat daftar relawan...</p>
          </div>
        ) : isError ? (
          <div className="py-14 text-center px-4 bg-red-50/50">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-red-800">
              Gagal Memuat Relawan
            </p>
            <p className="text-[11px] text-red-600/80 mt-0.5 max-w-xs mx-auto mb-3">
              {errorMessage || 'Terjadi kesalahan jaringan saat mengambil data relawan siaga.'}
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition cursor-pointer shadow-2xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Coba Lagi</span>
              </button>
            )}
          </div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="py-16 text-center px-4">
            <Users className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-neutral-700">
              Tidak ada relawan yang sesuai
            </p>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Coba gunakan kata kunci pencarian nama atau kabupaten lain
            </p>
          </div>
        ) : (
          paginatedVolunteers.map((vol) => {
            const activeTasks = vol._count?.volunteerTasks ?? 0

            return (
              <div
                key={vol.id}
                className="p-3.5 sm:p-4 hover:bg-neutral-50/80 transition flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={
                      vol.avatarUrl ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
                    }
                    alt={vol.name}
                    className="w-11 h-11 rounded-2xl object-cover border border-neutral-200 shrink-0"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-extrabold text-xs sm:text-sm text-neutral-900 truncate">
                        {vol.name}
                      </h4>
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-black px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Siaga
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                        <span className="truncate font-semibold text-neutral-700">
                          {vol.kabupaten}
                        </span>
                        <span className="text-neutral-400">({vol.province})</span>
                      </span>
                      <span>•</span>
                      <span className="text-neutral-400 shrink-0">
                        {activeTasks > 0 ? (
                          <span className="text-amber-600 font-bold">
                            {activeTasks} tugas aktif
                          </span>
                        ) : (
                          '0 tugas'
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                      <Phone className="w-3 h-3" />
                      <span>{vol.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Assign Button */}
                <button
                  type="button"
                  onClick={() => onAssignVolunteer(vol)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer group-hover:scale-102"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Tugaskan</span>
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* Pagination Footer (Limit 10 per halaman) */}
      {!isLoading && !isError && filteredVolunteers.length > 0 && (
        <div className="p-3.5 sm:p-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/70">
          <p className="text-xs text-neutral-500 font-medium">
            Menampilkan{' '}
            <strong className="text-neutral-800">
              {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}
            </strong>{' '}
            -{' '}
            <strong className="text-neutral-800">
              {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredVolunteers.length)}
            </strong>{' '}
            dari{' '}
            <strong className="text-neutral-800">
              {filteredVolunteers.length}
            </strong>{' '}
            relawan
          </p>

          <div className="flex items-center gap-1.5 self-center sm:self-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
              className="px-2.5 py-1.5 rounded-lg border border-neutral-200 text-xs font-bold text-neutral-700 bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:pointer-events-none transition flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                  safeCurrentPage === page
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage === totalPages}
              className="px-2.5 py-1.5 rounded-lg border border-neutral-200 text-xs font-bold text-neutral-700 bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:pointer-events-none transition flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
