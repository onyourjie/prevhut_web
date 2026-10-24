import { Link } from '@tanstack/react-router';
import { User as UserIcon } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';

export function ProfileUnauthenticatedView() {
  return (
    <AppLayout title="Profil Pengguna">
      <div className="py-16 text-center max-w-sm mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-base font-extrabold text-neutral-900">
          Masuk untuk Mengakses Profil
        </h2>
        <p className="text-xs text-neutral-500">
          Lihat riwayat laporan, kelola domisili, dan sinkronkan notifikasi tanggap karhutla.
        </p>
        <div className="flex gap-2 pt-2">
          <Link
            to="/login"
            className="flex-1 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition text-center"
          >
            Masuk
          </Link>
          <Link
            to="/register"
            className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-neutral-800 text-xs font-bold hover:bg-neutral-50 transition text-center"
          >
            Daftar
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
