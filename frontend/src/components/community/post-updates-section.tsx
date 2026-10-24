import { Plus } from "lucide-react";
import { CommunityVideoPlayer } from "@/components/community/community-video-player";
import { isVideoMedia } from "@/lib/cloudinary";
import { formatTimeAgo } from "@/lib/utils";

interface PostUpdatesSectionProps {
  updates?: any[];
  isAuthor: boolean;
  onAddUpdateClick: () => void;
  onMediaClick: (url: string) => void;
}

export function PostUpdatesSection({
  updates,
  isAuthor,
  onAddUpdateClick,
  onMediaClick,
}: PostUpdatesSectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-3 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider">
            Update Pengirim
          </h3>
          <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800">
            {updates?.length || 0} pembaruan
          </span>
        </div>

        {isAuthor && (
          <button
            type="button"
            onClick={onAddUpdateClick}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Tambah</span>
          </button>
        )}
      </div>

      {updates && updates.length > 0 ? (
        <div className="space-y-2.5">
          {updates.map((update: any, idx: number) => (
            <div
              key={update.id}
              className="p-3 rounded-xl bg-orange-50/50 border border-orange-200/70 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={
                      update.author?.avatarUrl ||
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80"
                    }
                    alt={update.author?.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs font-bold text-neutral-900">
                    {update.author?.name}
                  </span>
                  {idx === 0 && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-red-600 text-white">
                      Terbaru
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-neutral-400">
                  {formatTimeAgo(update.createdAt)}
                </span>
              </div>

              <p className="text-xs text-neutral-700 leading-relaxed">
                {update.content}
              </p>

              {update.imageUrl && (
                <div className="mt-2 w-full max-w-sm sm:max-w-md">
                  {isVideoMedia(update.imageUrl) ? (
                    <div className="relative rounded-xl overflow-hidden border border-orange-200 bg-black aspect-video flex items-center justify-center shadow-xs">
                      <CommunityVideoPlayer
                        src={update.imageUrl}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => onMediaClick(update.imageUrl)}
                      className="relative rounded-xl overflow-hidden border border-orange-200 bg-neutral-950 aspect-video flex items-center justify-center cursor-pointer group shadow-xs"
                      title="Ketuk untuk melihat foto ukuran penuh"
                    >
                      <img
                        src={update.imageUrl}
                        alt="Bukti update"
                        className="w-full h-full object-contain group-hover:scale-102 transition duration-200"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center rounded-xl bg-neutral-50 border border-neutral-100 text-neutral-400 text-xs">
          Belum ada update kondisi terbaru dari pelapor.
        </div>
      )}
    </div>
  );
}
