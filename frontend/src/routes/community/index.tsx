import React, { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Search,
  Filter,
  PlusCircle,
  AlertTriangle,
  Camera,
  RefreshCw,
  X,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { PostCard, type PostItem } from '@/components/community/post-card';
import { FilterModal, type FilterState } from '@/components/community/filter-modal';
import { apiRequest } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

export const Route = createFileRoute('/community/')({
  component: CommunityPage,
});

function CommunityPage() {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filter, setFilter] = useState<FilterState>({
    category: '',
    provinsi: '',
    kabupaten: '',
    kecamatan: '',
  });

  // TanStack Query untuk daftar postingan komunitas (caching, deduplikasi, dan instan)
  const {
    data: posts = [],
    isLoading,
    refetch: fetchPosts,
  } = useQuery<PostItem[]>({
    queryKey: ['community-posts', filter, submittedSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter.category) params.append('category', filter.category);
      if (filter.provinsi) params.append('province', filter.provinsi);
      if (filter.kabupaten) params.append('kabupaten', filter.kabupaten);
      if (filter.kecamatan) params.append('kecamatan', filter.kecamatan);
      if (submittedSearch.trim()) params.append('search', submittedSearch.trim());

      const url = `/community/posts${params.toString() ? `?${params.toString()}` : ''}`;
      const data = await apiRequest<PostItem[]>(url);
      return data || [];
    },
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedSearch(searchTerm.trim());
    fetchPosts();
  };

  const emergencyPosts = posts.filter(
    (p) => p.category === 'DARURAT' && p.status !== 'SELESAI' && p.status !== 'DITOLAK'
  );
  const hasActiveFilters = Boolean(
    filter.category || filter.kabupaten || filter.kecamatan || filter.provinsi
  );

  return (
    <AppLayout
      title="Komunitas"
      subtitle="Kabar dari warga dan relawan tanggap karhutla"
      
    >
      <div className="max-w-2xl mx-auto space-y-4 text-left">
        {/* Mobile Page Header */}
        <div className="flex sm:hidden items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-neutral-900 leading-tight">
                Komunitas
              </h1>
              <p className="text-[11px] text-neutral-500">Kabar warga & relawan</p>
            </div>
          </div>


        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari postingan, lokasi, pelapor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-xs"
            />
          </form>

          <button
            type="button"
            onClick={() => setShowFilterModal(true)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition shadow-xs shrink-0 ${
              hasActiveFilters
                ? 'bg-orange-50 border-orange-300 text-orange-800'
                : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#eb5314' }} />
            )}
          </button>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            {filter.category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 font-bold text-[11px]">
                {filter.category}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setFilter({ ...filter, category: '' })}
                />
              </span>
            )}
            {filter.provinsi && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-semibold text-[11px]">
                {filter.provinsi}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setFilter({ ...filter, provinsi: '', kabupaten: '', kecamatan: '' })}
                />
              </span>
            )}
            {filter.kabupaten && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-200 text-neutral-800 font-semibold text-[11px]">
                {filter.kabupaten}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setFilter({ ...filter, kabupaten: '', kecamatan: '' })}
                />
              </span>
            )}
            {filter.kecamatan && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-200 text-neutral-800 font-semibold text-[11px]">
                {filter.kecamatan}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setFilter({ ...filter, kecamatan: '' })}
                />
              </span>
            )}
            <button
              type="button"
              onClick={() =>
                setFilter({ category: '', provinsi: '', kabupaten: '', kecamatan: '' })
              }
              className="text-[11px] font-bold text-neutral-500 hover:text-brand-600 underline ml-1"
            >
              Hapus semua
            </button>
          </div>
        )}

        {/* Quick Create Card: "Tulis apa yang terjadi di sekitarmu..." */}
        <Link
          to="/community/create"
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-neutral-300 shadow-xs hover:border-orange-400 hover:shadow-sm transition group"
        >
          <img
            src={
              user?.avatarUrl ||
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'
            }
            alt={user?.name || 'Warga'}
            className="w-9 h-9 rounded-full object-cover border border-neutral-200 shrink-0"
          />
          <div className="flex-1 text-xs text-neutral-500 font-medium">
            Tulis apa yang terjadi di sekitarmu...
          </div>
          <div
            className="w-8 h-8 rounded-xl text-white flex items-center justify-center transition shadow-xs group-hover:scale-105"
            style={{ backgroundColor: '#eb5314' }}
          >
            <Camera className="w-4 h-4 text-white" />
          </div>
        </Link>

        {/* Emergency Highlight Banner (Vivid red icon & high-contrast container) */}
        {emergencyPosts.length > 0 && filter.category !== 'DARURAT' && (
          <div
            onClick={() => setFilter({ ...filter, category: 'DARURAT' })}
            className="p-3.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition shadow-xs group"
            style={{
              backgroundColor: '#fef2f2',
              borderColor: '#fca5a5',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ backgroundColor: '#dc2626' }}
              >
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xs font-black text-red-950 block leading-tight group-hover:text-red-700 transition">
                  Lihat unggahan darurat lainnya
                </span>
                <span className="text-[11px] text-red-700 font-semibold mt-0.5 block">
                  {emergencyPosts.length} laporan memerlukan perhatian tim posko
                </span>
              </div>
            </div>
            <span
              className="px-2.5 py-1 rounded-full text-xs font-black text-white shadow-xs"
              style={{ backgroundColor: '#dc2626' }}
            >
              {emergencyPosts.length}
            </span>
          </div>
        )}

        {/* Post Feed List */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-neutral-400 gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-brand-600" />
            <span className="text-xs font-semibold">Memuat kabar komunitas...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-neutral-300 p-8 shadow-xs">
            <Users className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="font-bold text-sm text-neutral-800 mb-1">
              Belum Ada Postingan
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
              Tidak ada kabar yang sesuai dengan filter lokasi atau kata kunci saat ini. Jadilah yang pertama membagikan kondisi sekitar!
            </p>
            <Link
              to="/community/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-bold transition shadow-sm"
              style={{ backgroundColor: '#eb5314' }}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Laporan Baru</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <FilterModal
          currentFilter={filter}
          onApply={(newFilter) => setFilter(newFilter)}
          onClose={() => setShowFilterModal(false)}
        />
      )}
    </AppLayout>
  );
}
