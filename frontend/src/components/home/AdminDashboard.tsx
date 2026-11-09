import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Activity,
  Truck,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Compass,
  ArrowRight,
  RefreshCw,
  ClipboardList,
  ShieldAlert,
  Phone,
  Users,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { formatTimeAgo, cn } from '@/lib/utils';
import { showSuccessToast, showErrorToast } from '@/lib/swal';
import { CreateAssignmentModal } from '@/components/assignments/CreateAssignmentModal';
import type { IncidentGroup } from '@/components/reports/IncidentCard';
import type { Assignment } from '@/components/assignments/assignment.types';
import type { VolunteerItem } from '@/components/assignments/VolunteerDirectoryPanel';

interface AdminDashboardProps {
  userLocation: {
    province?: string;
    regency?: string;
    district?: string;
    coords?: { lat: number; lng: number };
  };
  totalHotspots: number | null;
  priorityAreas: any[];
  isSample?: boolean;
  lastSyncTime: string;
}

export function AdminDashboard({
  userLocation,
  totalHotspots,
  priorityAreas,
  isSample,
  lastSyncTime,
}: AdminDashboardProps) {
  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = useState(false);
  const [assignIncident, setAssignIncident] = useState<IncidentGroup | null>(null);

  // 1. Ambil seluruh insiden darurat warga
  const { data: incidents = [], isLoading: isLoadingIncidents } = useQuery<IncidentGroup[]>({
    queryKey: ['admin-incidents'],
    queryFn: () => apiRequest<IncidentGroup[]>('/community/incidents'),
  });

  // 2. Ambil daftar relawan yang sedang standby (isAvailable: true)
  const { data: availableVolunteers = [] } = useQuery<VolunteerItem[]>({
    queryKey: ['admin-available-volunteers'],
    queryFn: () => apiRequest<VolunteerItem[]>('/users/volunteers'),
  });

  // 3. Ambil daftar seluruh penugasan untuk memantau operasi berjalan
  const { data: allAssignments = [], isLoading: isLoadingAssignments } = useQuery<Assignment[]>({
    queryKey: ['admin-assignments'],
    queryFn: () => apiRequest<Assignment[]>('/assignments'),
  });

  // 4. Hitung metrik operasional
  const unassignedIncidents = incidents.filter(
    (inc) => inc.status === 'MENUNGGU_VERIFIKASI'
  );
  const activeAssignments = allAssignments.filter((a) =>
    ['ACCEPTED', 'ON_THE_WAY', 'ON_SITE'].includes(a.status)
  );
  const activeSupportRequests = activeAssignments.filter(
    (a: any) => a.needsSupport === true
  );

  // 5. Trigger manual sync satelit NASA FIRMS
  const handleTriggerSync = async () => {
    setIsSyncing(true);
    try {
      const res = await apiRequest<{ message?: string; count?: number }>('/sync/trigger', {
        method: 'POST',
      });
      showSuccessToast(
        res?.message || 'Sinkronisasi satelit NASA FIRMS berhasil diperbarui!'
      );
      // Invalidate queries agar data otomatis segar
      queryClient.invalidateQueries({ queryKey: ['priority-areas'] });
      queryClient.invalidateQueries({ queryKey: ['admin-incidents'] });
      queryClient.invalidateQueries({ queryKey: ['admin-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['sync-status'] });
    } catch (err: any) {
      showErrorToast(err?.message || 'Gagal memicu sinkronisasi satelit manual');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. SATELLITE SYNC & COMMAND BANNER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white shadow-sm border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
              Pusat Komando Siaga Karhutla
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
            Posko Pantau & Operasi {userLocation.regency || 'Kalimantan Barat'}
          </h2>
          <p className="text-xs text-slate-400">
            Pembaruan satelit NASA FIRMS VIIRS 375m • Terakhir sinkron: {lastSyncTime}
          </p>
        </div>

        <button
          type="button"
          onClick={handleTriggerSync}
          disabled={isSyncing}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-95 text-white text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
        >
          <RefreshCw className={cn('w-3.5 h-3.5', isSyncing && 'animate-spin')} />
          <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Satelit Sekarang'}</span>
        </button>
      </div>

      {isSample && (
        <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Mode Data Sampel: Beberapa koordinat menggunakan data simulasi pengujian posko.</span>
        </div>
      )}

      {/* 2. OPERATIONAL KPI METRICS GRID (4 CARDS) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Antrean Laporan Butuh Tindak Lanjut */}
        <Link
          to="/reports"
          className="block p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-red-400 hover:shadow-xs transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Antrean Butuh Aksi
            </span>
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                unassignedIncidents.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-slate-300'
              )}
            />
          </div>
          <p
            className={cn(
              'text-2xl font-black mt-1.5',
              unassignedIncidents.length > 0 ? 'text-red-600' : 'text-slate-900'
            )}
          >
            {isLoadingIncidents ? '...' : unassignedIncidents.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
            {unassignedIncidents.length > 0
              ? 'Laporan belum didisposisi'
              : 'Semua laporan tertangani'}
          </p>
        </Link>

        {/* Relawan Standby */}
        <Link
          to="/assignments"
          className="block p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-400 hover:shadow-xs transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Relawan Siaga
            </span>
            <Users className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-1.5">
            {availableVolunteers.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
            Siap dikirim ke titik api
          </p>
        </Link>

        {/* Operasi Lapangan Aktif */}
        <Link
          to="/assignments"
          className="block p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-xs transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Operasi Berjalan
            </span>
            <Truck className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-600 mt-1.5">
            {isLoadingAssignments ? '...' : activeAssignments.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
            Regu meluncur & memadamkan
          </p>
        </Link>

        {/* Titik Panas Satelit */}
        <Link
          to="/map"
          className="block p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-orange-400 hover:shadow-xs transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Hotspot Satelit
            </span>
            <Activity className="w-3.5 h-3.5 text-orange-600" />
          </div>
          <p className="text-2xl font-black text-orange-600 mt-1.5">
            {totalHotspots ?? 0}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
            {priorityAreas.length} area prioritas pantau
          </p>
        </Link>
      </div>

      {/* 3. URGENT ACTION QUEUE: LAPORAN DARURAT WARGA BUTUH DISPOSISI */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                Antrean Darurat Mendesak
              </h3>
              <p className="text-[11px] text-slate-500">
                Laporan kebakaran warga yang memerlukan validasi & penugasan regu posko
              </p>
            </div>
          </div>

          <Link
            to="/reports"
            className="text-xs font-bold text-brand-700 hover:text-brand-800 transition flex items-center gap-1"
          >
            <span>Semua Laporan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {unassignedIncidents.length > 0 ? (
          <div className="space-y-2.5">
            {unassignedIncidents.slice(0, 4).map((incident) => {
              const latestPost = incident.posts[0];
              return (
                <div
                  key={incident.key}
                  className="p-3.5 rounded-xl border border-slate-200/90 border-l-4 border-l-red-500 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-xs text-slate-900 truncate">
                        {incident.title}
                      </span>
                      {incident.clusterCode && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-200">
                          {incident.clusterCode}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">
                        {formatTimeAgo(incident.latestCreatedAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{incident.address || `${incident.kecamatan}, ${incident.kabupaten}`}</span>
                    </div>

                    {latestPost?.content && (
                      <p className="text-xs text-slate-700 line-clamp-1 italic">
                        "{latestPost.content}"
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setAssignIncident(incident)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-2xs cursor-pointer shrink-0"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Disposisi Relawan</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 px-4 rounded-xl bg-slate-50 border border-slate-200/70 text-center space-y-1">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
            <h4 className="text-xs font-bold text-slate-800">
              Semua Laporan Warga Telah Tertangani
            </h4>
            <p className="text-[11px] text-slate-500">
              Tidak ada antrean laporan darurat yang menunggu tindakan posko saat ini.
            </p>
          </div>
        )}
      </div>

      {/* 4. ACTIVE FIELD OPERATIONS & SATELLITE RADAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Monitoring Regu Lapangan */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Regu Lapangan Aktif ({activeAssignments.length})
              </h3>
            </div>
            <Link
              to="/assignments"
              className="text-[11px] font-bold text-brand-700 hover:underline"
            >
              Lihat Log →
            </Link>
          </div>

          {activeSupportRequests.length > 0 && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 font-bold flex items-center gap-2 animate-pulse">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Ada {activeSupportRequests.length} regu meminta bantuan personil/alat tambahan!</span>
            </div>
          )}

          {activeAssignments.length > 0 ? (
            <div className="space-y-2">
              {activeAssignments.slice(0, 3).map((assignment) => (
                <div
                  key={assignment.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900">
                      {assignment.volunteer?.name || 'Relawan'}
                    </span>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider',
                        assignment.status === 'ON_SITE'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      )}
                    >
                      {assignment.status === 'ON_SITE' ? 'Di Lokasi Api' : 'Menuju Lokasi'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 truncate">
                    {assignment.post?.address || assignment.clusterCode || 'Lokasi tugas'}
                  </p>

                  {assignment.volunteer?.phone && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{assignment.volunteer.phone}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-400">
              Tidak ada regu lapangan yang sedang beroperasi saat ini.
            </div>
          )}
        </div>

        {/* Prioritas Klaster Tertinggi */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-orange-600" />
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Area Prioritas Satelit ({priorityAreas.length})
              </h3>
            </div>
            <Link
              to="/map"
              className="text-[11px] font-bold text-brand-700 hover:underline"
            >
              Buka Peta Spasial →
            </Link>
          </div>

          {priorityAreas.length > 0 ? (
            <div className="space-y-2">
              {priorityAreas.slice(0, 3).map((area, idx) => (
                <div
                  key={area.clusterCode || idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-extrabold text-slate-900 block truncate">
                      {area.clusterCode}: {area.name || area.regency}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate">
                      Skor Risiko: {area.riskScore ?? 'Sedang'} • {area.hotspotCount ?? 0} titik api
                    </span>
                  </div>

                  <Link
                    to="/map"
                    search={{ area: area.clusterCode }}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-brand-600 transition shrink-0"
                    title="Lihat polygon klaster"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-400">
              Tidak ada klaster risiko tinggi terdeteksi saat ini.
            </div>
          )}
        </div>
      </div>

      {/* 5. COMMAND HUB: NAVIGASI CEPAT 4 MODUL OPERASIONAL */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <Link to="/assignments" className="block group">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500 hover:shadow-xs transition space-y-1.5 h-full">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Truck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-700 transition">
              Disposisi Relawan
            </h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Bagi tugas, pantau posisi regu, dan verifikasi bukti foto GPS.
            </p>
          </div>
        </Link>

        <Link to="/reports" className="block group">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-red-500 hover:shadow-xs transition space-y-1.5 h-full">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
              <ClipboardList className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-red-700 transition">
              Manajemen Insiden
            </h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Rekap seluruh laporan titik api warga per klaster lokasi.
            </p>
          </div>
        </Link>

        <Link to="/map" className="block group">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-orange-500 hover:shadow-xs transition space-y-1.5 h-full">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-orange-700 transition">
              Peta Operasi Spasial
            </h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Pemodelan spasial DBSCAN, arah angin, dan polygon risiko.
            </p>
          </div>
        </Link>

        <Link to="/moderation" className="block group">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-700 hover:shadow-xs transition space-y-1.5 h-full">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-slate-900 transition">
              Moderasi Aduan
            </h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Tinjau laporan warga yang diadukan sebagai spam atau hoaks.
            </p>
          </div>
        </Link>
      </div>

      {/* DISPOSISI MODAL */}
      {assignIncident && (
        <CreateAssignmentModal
          isOpen={Boolean(assignIncident)}
          targetPost={assignIncident.posts[0] || assignIncident}
          onClose={() => setAssignIncident(null)}
          onSuccess={() => {
            setAssignIncident(null);
            queryClient.invalidateQueries({ queryKey: ['admin-incidents'] });
            queryClient.invalidateQueries({ queryKey: ['admin-assignments'] });
            queryClient.invalidateQueries({ queryKey: ['admin-available-volunteers'] });
            showSuccessToast('Penugasan relawan berhasil dikirim!');
          }}
        />
      )}
    </div>
  );
}
