import { Link } from "@tanstack/react-router";
import { AlertTriangle, Info, MapPin, Camera, Video, Compass } from "lucide-react";
import { CommunityVideoPlayer } from "@/components/community/community-video-player";
import { isVideoMedia } from "@/lib/cloudinary";
import { formatTimeAgo, formatDateTimeIndo } from "@/lib/utils";

interface PostDetailMainCardProps {
  post: any;
  onMediaClick: (url: string) => void;
}

export function PostDetailMainCard({
  post,
  onMediaClick,
}: PostDetailMainCardProps) {
  const isEmergency = post.category === "DARURAT";

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs p-5 space-y-4">
      {/* Author Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={
              post.author?.avatarUrl ||
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80"
            }
            alt={post.author?.name}
            className="w-10 h-10 rounded-full object-cover border border-neutral-200"
          />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-sm text-neutral-900 leading-tight">
                {post.author?.name}
              </span>
              <span className="text-neutral-300">•</span>
              <span className="text-[11px] font-bold px-1.5 py-0.2 rounded bg-brand-100 text-brand-800">
                {post.author?.role === "ADMIN"
                  ? "Admin Posko"
                  : post.author?.role === "RELAWAN"
                  ? "Relawan"
                  : "Warga"}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              {formatTimeAgo(post.createdAt)}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
            isEmergency
              ? "bg-red-100 text-red-700 border border-red-200"
              : "bg-teal-50 text-teal-800 border border-teal-200"
          }`}
        >
          {isEmergency ? (
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          ) : (
            <Info className="w-3.5 h-3.5 text-teal-600" />
          )}
          {isEmergency ? "Darurat" : "Informasi"}
        </span>
      </div>

      {/* Address & Connected Satellite Cluster */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-start gap-1.5 text-neutral-600 text-xs min-w-0">
          <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
          <span className="leading-snug truncate">{post.address}</span>
        </div>

        {post.clusterCode && (
          <Link
            to="/map"
            search={{ area: post.clusterCode }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 hover:bg-orange-200 text-orange-950 border border-orange-300 transition shadow-2xs shrink-0"
          >
            <Compass className="w-3.5 h-3.5 text-orange-700" />
            <span>Terkait {post.clusterCode}</span>
            <span className="text-[10px] text-orange-700 font-extrabold underline">
              Buka di Peta &rarr;
            </span>
          </Link>
        )}
      </div>

      {/* Content Text */}
      <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed whitespace-pre-line">
        {post.content}
      </p>

      {/* Media Bukti (Foto atau Video) */}
      {post.imageUrl && (
        <div className="relative rounded-xl overflow-hidden border border-neutral-200 bg-black aspect-video sm:aspect-[16/10] flex items-center justify-center group">
          {isVideoMedia(post.imageUrl) ? (
            <CommunityVideoPlayer
              src={post.imageUrl}
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={post.imageUrl}
              alt="Foto kejadian"
              onClick={() => onMediaClick(post.imageUrl)}
              className="w-full h-full object-contain cursor-pointer select-none"
            />
          )}
          {post.isLiveCamera && (
            <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 pointer-events-none z-10">
              {isVideoMedia(post.imageUrl) ? (
                <Video className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Camera className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>
                {isVideoMedia(post.imageUrl) ? "Video" : "Foto"} • {formatDateTimeIndo(post.createdAt)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
