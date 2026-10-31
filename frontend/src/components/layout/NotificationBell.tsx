import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  CheckCheck,
  Flame,
  ClipboardList,
  Info,
  Radio,
  CheckCircle2,
  Loader2,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import {
  fetchMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type NotificationItem,
} from '@/features/notifications/api';
import { useFcmNotification } from '@/features/notifications/useFcmNotification';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';

function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return 'Baru saja';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} hari lalu`;
}

function getNotificationIcon(type: NotificationItem['type']) {
  switch (type) {
    case 'ALERT_PRIORITAS':
      return <Flame className="w-4 h-4 text-red-600" />;
    case 'TUGAS_BARU':
      return <ClipboardList className="w-4 h-4 text-orange-600" />;
    case 'UPDATE_STATUS':
      return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    case 'KOMENTAR':
      return <Radio className="w-4 h-4 text-blue-600" />;
    default:
      return <Info className="w-4 h-4 text-neutral-600" />;
  }
}

export interface NotificationBellProps {
  className?: string;
}

export function NotificationBell({ className }: NotificationBellProps) {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { isSubscribed, isLoading: isFcmLoading, enableNotifications } =
    useFcmNotification();

  // Query daftar notifikasi
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchMyNotifications,
    enabled: isAuthenticated,
    refetchInterval: 30000, // Cek berkala tiap 30 detik
  });

  const unreadCount = data?.unread_count ?? 0;
  const notifications = data?.all ?? [];

  // Mutation tandai 1 dibaca
  const readOneMutation = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mutation tandai semua dibaca
  const readAllMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Klik item notifikasi -> tandai dibaca & arahkan ke halaman terkait
  const handleItemClick = (item: NotificationItem) => {
    if (!item.isRead) {
      readOneMutation.mutate(item.id);
    }
    setIsOpen(false);

    if (item.metadata?.assignmentId || item.type === 'TUGAS_BARU' || item.type === 'UPDATE_STATUS') {
      navigate({ to: '/assignments' });
    } else if (item.type === 'ALERT_PRIORITAS') {
      navigate({ to: '/map' });
    } else if (item.metadata?.postId || item.type === 'KOMENTAR') {
      navigate({ to: '/community' });
    } else {
      navigate({ to: '/emergency' });
    }
  };

  // Tutup dropdown saat klik di luar atau tombol Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={containerRef}>
      {/* Tombol Lonceng */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 cursor-pointer',
          isOpen
            ? 'bg-neutral-100 text-neutral-900 ring-2 ring-orange-500/30'
            : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200/80',
          className,
        )}
        title="Pusat Pemberitahuan"
        aria-label="Pusat Pemberitahuan"
        aria-expanded={isOpen}
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5" />

        {/* Badge Unread Count */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-h-[85vh] bg-white rounded-2xl border border-neutral-200/90 shadow-2xl shadow-neutral-950/10 z-50 flex flex-col overflow-hidden text-left"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-neutral-50/80 border-b border-neutral-200/70 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-neutral-900">Pemberitahuan</h3>
                <p className="text-[10px] text-neutral-500">
                  {unreadCount > 0 ? `${unreadCount} belum dibaca` : 'Semua telah dibaca'}
                </p>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => readAllMutation.mutate()}
                  disabled={readAllMutation.isPending}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-600 hover:text-orange-700 transition disabled:opacity-50 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Tandai dibaca</span>
                </button>
              )}
            </div>

            {/* Banner Status Web Push (FCM) */}
            <div className="px-4 py-2.5 bg-neutral-50/70 border-b border-neutral-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={cn(
                    'w-2 h-2 rounded-full shrink-0',
                    isSubscribed ? 'bg-emerald-500' : 'bg-amber-500 animate-ping',
                  )}
                />
                <p className="text-[11px] text-neutral-600 truncate">
                  {isSubscribed ? (
                    <span className="font-semibold text-emerald-800">Push Notification Aktif</span>
                  ) : (
                    <span>Peringatan HP/Web Belum Aktif</span>
                  )}
                </p>
              </div>

              {isSubscribed ? (
                <button
                  type="button"
                  onClick={enableNotifications}
                  disabled={isFcmLoading}
                  className="shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-medium text-neutral-600 hover:text-neutral-900 border border-neutral-200 hover:bg-neutral-50 shadow-2xs flex items-center gap-1 transition cursor-pointer disabled:opacity-50"
                  title="Sinkronkan ulang token perangkat ke server"
                >
                  {isFcmLoading ? (
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-2.5 h-2.5 text-neutral-500" />
                  )}
                  <span>Sinkron</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={enableNotifications}
                  disabled={isFcmLoading}
                  className="shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-orange-600 text-white hover:bg-orange-700 shadow-2xs flex items-center gap-1 transition disabled:opacity-50 cursor-pointer"
                >
                  {isFcmLoading ? (
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                  ) : (
                    <Bell className="w-2.5 h-2.5" />
                  )}
                  <span>Aktifkan</span>
                </button>
              )}
            </div>

            {/* Daftar Notifikasi */}
            <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 max-h-[360px]">
              {isLoading ? (
                <div className="p-8 text-center text-xs text-neutral-400 flex flex-col items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                  <span>Memuat pemberitahuan...</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-400">
                  <Bell className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                  <p className="font-medium text-neutral-600">Belum ada notifikasi</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Peringatan titik api dan penugasan relawan akan muncul di sini.
                  </p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      'p-3.5 transition flex items-start gap-3 cursor-pointer group',
                      !item.isRead ? 'bg-orange-50/25 hover:bg-orange-50/50' : 'bg-white hover:bg-neutral-50',
                    )}
                  >
                    {/* Ikon Tipe */}
                    <div className="w-8 h-8 rounded-xl bg-neutral-100 group-hover:bg-white flex items-center justify-center shrink-0 border border-neutral-200/60 mt-0.5 transition">
                      {getNotificationIcon(item.type)}
                    </div>

                    {/* Isi Pesan */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p
                          className={cn(
                            'text-xs truncate',
                            !item.isRead ? 'font-bold text-neutral-900' : 'font-medium text-neutral-700',
                          )}
                        >
                          {item.title}
                        </p>
                        <span className="text-[10px] text-neutral-400 shrink-0">
                          {formatRelativeTime(item.createdAt)}
                        </span>
                      </div>

                      <p className="text-[11px] text-neutral-600 line-clamp-2 mt-0.5 leading-relaxed">
                        {item.message}
                      </p>
                    </div>

                    {/* Chevron or Dot */}
                    <div className="flex items-center gap-1 shrink-0 mt-1">
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-orange-600" />
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-600 transition" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
