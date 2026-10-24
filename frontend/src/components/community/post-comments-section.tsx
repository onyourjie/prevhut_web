import { CommunityVideoPlayer } from "@/components/community/community-video-player";
import { isVideoMedia } from "@/lib/cloudinary";
import { formatTimeAgo } from "@/lib/utils";

interface PostCommentsSectionProps {
  comments?: any[];
  onMediaClick: (url: string) => void;
}

export function PostCommentsSection({
  comments,
  onMediaClick,
}: PostCommentsSectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-4 shadow-xs">
      <div className="flex items-center gap-2">
        <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider">
          Komentar & Verifikasi Warga
        </h3>
        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-700">
          {comments?.length || 0}
        </span>
      </div>

      <div className="space-y-3">
        {comments && comments.length > 0 ? (
          comments.map((c: any) => (
            <div key={c.id} className="flex items-start gap-2.5 text-xs">
              <img
                src={
                  c.author?.avatarUrl ||
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80"
                }
                alt={c.author?.name}
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-neutral-200 mt-0.5"
              />
              <div className="flex-1 bg-neutral-50 rounded-xl p-3 border border-neutral-100 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-neutral-900 text-xs">
                      {c.author?.name}
                    </span>
                    <span className="text-[10px] px-1 py-0.2 rounded bg-neutral-200 font-semibold text-neutral-700">
                      {c.author?.role}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400">
                    {formatTimeAgo(c.createdAt)}
                  </span>
                </div>

                <p className="text-neutral-700 leading-relaxed">{c.content}</p>

                {c.imageUrl && (
                  <div className="mt-2 w-full max-w-sm sm:max-w-md">
                    {isVideoMedia(c.imageUrl) ? (
                      <div className="relative rounded-xl overflow-hidden border border-neutral-300 bg-black aspect-video flex items-center justify-center shadow-xs">
                        <CommunityVideoPlayer
                          src={c.imageUrl}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => onMediaClick(c.imageUrl)}
                        className="relative rounded-xl overflow-hidden border border-neutral-300 bg-neutral-950 aspect-video flex items-center justify-center cursor-pointer group shadow-xs"
                        title="Ketuk untuk melihat foto ukuran penuh"
                      >
                        <img
                          src={c.imageUrl}
                          alt="Bukti komentar"
                          className="w-full h-full object-contain group-hover:scale-102 transition duration-200"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-xs text-neutral-400">
            Belum ada komentar. Berikan info terkini atau pesan koordinasi di bawah!
          </div>
        )}
      </div>
    </div>
  );
}
