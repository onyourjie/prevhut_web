import React, { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Search,
  Filter,
  PlusCircle,
  Camera,
  RefreshCw,
  X,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
  const latestEmergency = emergencyPosts[0];
  const latestEmergencyLocation =
    latestEmergency?.kecamatan ||
    latestEmergency?.kabupaten ||
    latestEmergency?.address ||
    '';
  const hasActiveFilters = Boolean(
    filter.provinsi || filter.kabupaten || filter.kecamatan
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

        {/* Full-Width Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari postingan, lokasi, pelapor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-2xs"
          />
        </form>

        {/* Unified Filter Controls Row: Left has Category Chips, Right has Wilayah Filter Button */}
        <div className="flex items-center justify-between gap-2">
          {/* Left: Category Toggle Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Darurat Api Toggle Chip */}
            <button
              type="button"
              onClick={() =>
                setFilter((prev) => ({
                  ...prev,
                  category: prev.category === 'DARURAT' ? '' : 'DARURAT',
                }))
              }
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer shadow-2xs',
                filter.category === 'DARURAT'
                  ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
              )}
            >
              <span>Darurat Api</span>
              {emergencyPosts.length > 0 && (
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded-full text-[10px] font-black',
                    filter.category === 'DARURAT'
                      ? 'bg-white/25 text-white'
                      : 'bg-red-100 text-red-700 border border-red-200'
                  )}
                >
                  {emergencyPosts.length}
                </span>
              )}
              {filter.category === 'DARURAT' && (
                <X className="w-3 h-3 ml-0.5 text-white/80 hover:text-white" />
              )}
            </button>

            {/* Informasi Warga Toggle Chip */}
            <button
              type="button"
              onClick={() =>
                setFilter((prev) => ({
                  ...prev,
                  category: prev.category === 'INFORMASI' ? '' : 'INFORMASI',
                }))
              }
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer shadow-2xs',
                filter.category === 'INFORMASI'
                  ? 'bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
              )}
            >
              <span>Informasi Warga</span>
              {filter.category === 'INFORMASI' && (
                <X className="w-3 h-3 ml-0.5 text-white/80 hover:text-white" />
              )}
            </button>

            {/* Clear category filter shortcut */}
            {filter.category && (
              <button
                type="button"
                onClick={() => setFilter((prev) => ({ ...prev, category: '' }))}
                className="text-[11px] font-semibold text-neutral-500 hover:text-brand-600 underline ml-1 cursor-pointer"
              >
                Semua
              </button>
            )}
          </div>

          {/* Right: Wilayah Filter Button */}
          <button
            type="button"
            onClick={() => setShowFilterModal(true)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition shadow-2xs shrink-0 cursor-pointer',
              hasActiveFilters
                ? 'bg-brand-50 border-brand-300 text-brand-800'
                : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
            )}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Wilayah</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-brand-600" />
            )}
          </button>
        </div>

        {/* Crisis Ticker Strip (Active Wildfire Situational Awareness) */}
        {emergencyPosts.length > 0 && filter.category !== 'DARURAT' && (
          <div
            onClick={() => setFilter((prev) => ({ ...prev, category: 'DARURAT' }))}
            className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-red-50/90 border border-red-200/90 hover:bg-red-100/80 hover:border-red-300 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black tracking-wider uppercase bg-red-600 text-white shrink-0">
                SIAGA API
              </span>
              <p className="text-xs text-red-950 font-medium truncate">
                <strong className="font-extrabold text-red-900">{emergencyPosts.length} titik api aktif</strong>
                {latestEmergencyLocation ? ` dilaporkan di ${latestEmergencyLocation}` : ' memerlukan respon lapangan'}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 group-hover:text-red-900 group-hover:translate-x-0.5 transition-all shrink-0">
              <span>Buka</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        )}

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            {filter.provinsi && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 font-semibold text-[11px] border border-neutral-200">
                {filter.provinsi}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-600"
                  onClick={() => setFilter((prev) => ({ ...prev, provinsi: '', kabupaten: '', kecamatan: '' }))}
                />
              </span>
            )}
            {filter.kabupaten && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 font-semibold text-[11px] border border-neutral-200">
                {filter.kabupaten}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-600"
                  onClick={() => setFilter((prev) => ({ ...prev, kabupaten: '', kecamatan: '' }))}
                />
              </span>
            )}
            {filter.kecamatan && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 font-semibold text-[11px] border border-neutral-200">
                {filter.kecamatan}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-600"
                  onClick={() => setFilter((prev) => ({ ...prev, kecamatan: '' }))}
                />
              </span>
            )}
            <button
              type="button"
              onClick={() =>
                setFilter((prev) => ({ ...prev, provinsi: '', kabupaten: '', kecamatan: '' }))
              }
              className="text-[11px] font-bold text-neutral-500 hover:text-brand-600 underline ml-1 cursor-pointer"
            >
              Reset Wilayah
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
