import { X } from 'lucide-react';

interface ProfileActivitiesModalProps {
  type: 'posts' | 'comments' | 'reports' | null;
  onClose: () => void;
  activities: any;
  onNavigatePost: (postId: string) => void;
}

export function ProfileActivitiesModal({
  type,
  onClose,
  activities,
  onNavigatePost,
}: ProfileActivitiesModalProps) {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-6">
        <div className="p-5 pb-3 flex items-center justify-between border-b border-neutral-100">
          <h3 className="text-base font-extrabold text-neutral-900">
            {type === 'posts' && 'Postingan Saya'}
            {type === 'comments' && 'Komentar Saya'}
            {type === 'reports' && 'Laporan Pelanggaran Konten'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-3">
          {type === 'posts' && (
            activities?.my_posts && activities.my_posts.length > 0 ? (
              activities.my_posts.map((p: any) => (
                <div
                  key={p.id}
                  onClick={() => onNavigatePost(p.id)}
                  className="block p-3 rounded-xl border border-neutral-200 hover:border-brand-500 bg-white transition space-y-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-brand-700">{p.category}</span>
                    <span className="text-neutral-400">
                      {new Date(p.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-800 line-clamp-2">{p.content}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-400 text-center py-6">Belum ada postingan</p>
            )
          )}

          {type === 'comments' && (
            activities?.my_comments && activities.my_comments.length > 0 ? (
              activities.my_comments.map((c: any) => (
                <div key={c.id} className="p-3 rounded-xl border border-neutral-200 bg-white space-y-1">
                  <p className="text-xs text-neutral-800">{c.content}</p>
                  <span className="text-[10px] text-neutral-400 block">
                    {new Date(c.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-400 text-center py-6">Belum ada komentar</p>
            )
          )}

          {type === 'reports' && (
            activities?.my_reports && activities.my_reports.length > 0 ? (
              activities.my_reports.map((r: any) => (
                <div key={r.id} className="p-3 rounded-xl border border-neutral-200 bg-white space-y-1">
                  <span className="text-xs font-bold text-red-600 block">{r.reason}</span>
                  <p className="text-xs text-neutral-600">{r.notes || 'Tidak ada catatan tambahan'}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-400 text-center py-6">Belum ada riwayat laporan</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
