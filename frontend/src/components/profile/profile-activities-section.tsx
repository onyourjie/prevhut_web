import { FileText, MessageSquare, Flag, ChevronRight } from 'lucide-react';

interface ProfileActivitiesSectionProps {
  activities: any;
  onOpenModal: (type: 'posts' | 'comments' | 'reports') => void;
}

export function ProfileActivitiesSection({
  activities,
  onOpenModal,
}: ProfileActivitiesSectionProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider px-1">
        Aktivitas Saya
      </h3>

      <div className="bg-white rounded-2xl border border-neutral-200 divide-y divide-neutral-100 overflow-hidden shadow-xs">
        <div
          onClick={() => onOpenModal('posts')}
          className="p-4 flex items-center justify-between hover:bg-neutral-50 cursor-pointer transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900">Postingan Saya</h4>
              <p className="text-[11px] text-neutral-500">
                {activities?.my_posts?.length ?? 0} laporan yang kamu bagikan
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </div>

        <div
          onClick={() => onOpenModal('comments')}
          className="p-4 flex items-center justify-between hover:bg-neutral-50 cursor-pointer transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900">Komentar Saya</h4>
              <p className="text-[11px] text-neutral-500">
                {activities?.my_comments?.length ?? 0} komentar yang pernah kamu buat
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </div>

        <div
          onClick={() => onOpenModal('reports')}
          className="p-4 flex items-center justify-between hover:bg-neutral-50 cursor-pointer transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900">Laporan Saya</h4>
              <p className="text-[11px] text-neutral-500">
                {activities?.my_reports?.length ?? 0} riwayat laporan konten hoax
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </div>
      </div>
    </div>
  );
}
