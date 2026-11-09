import { Link } from "@tanstack/react-router";
import { MapPin, Camera, Video, Compass, ArrowRight } from "lucide-react";
import { CommunityVideoPlayer } from "@/components/community/community-video-player";
import { isVideoMedia } from "@/lib/cloudinary";
import { formatTimeAgo, formatDateTimeIndo, cn } from "@/lib/utils";

interface PostDetailMainCardProps {
  post: any;
  onMediaClick: (url: string) => void;
}

export function PostDetailMainCard({
  post,
  onMediaClick,
}: PostDetailMainCardProps) {
  const isEmergency = post.category === "DARURAT";
  const authorRole = post.author?.role;

  return (
    <article
      className={cn(
        "bg-white rounded-2xl border transition-all overflow-hidden shadow-xs flex flex-col p-4 sm:p-5 space-y-4",
        isEmergency
          ? "border-l-4 border-l-red-500 border-slate-200/90"
          : "border-l-4 border-l-brand-500 border-slate-200/90"
      )}
    >
      {/* Masthead Header: Author, Time, Location, and Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <img
            src={
              post.author?.avatarUrl ||
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80"
            }
            alt={post.author?.name || "Warga"}
            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-sm text-slate-900 leading-tight">
                {post.author?.name || "Warga"}
              </span>
              {authorRole && authorRole !== "WARGA" && (
                <span
                  className={cn(
                    "text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded",
                    authorRole === "ADMIN"
                      ? "bg-slate-900 text-amber-400"
                      : "bg-emerald-100 text-emerald-800"
                  )}
                >
                  {authorRole === "ADMIN" ? "Admin Posko" : "Relawan"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
              <span>{formatTimeAgo(post.createdAt)}</span>
              {post.address && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 text-slate-600 font-medium">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate max-w-[220px] sm:max-w-md">{post.address}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right side status badge */}
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold border shrink-0",
            isEmergency
              ? post.status === "SELESAI"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : post.status === "DALAM_PENANGANAN"
                ? "bg-blue-50 text-blue-800 border-blue-200"
                : "bg-red-50 text-red-700 border-red-200"
              : "bg-slate-100 text-slate-700 border-slate-200"
          )}
        >
          {isEmergency
            ? post.status === "SELESAI"
              ? "Padam"
              : post.status === "DALAM_PENANGANAN"
              ? "Ditangani"
              : "Darurat Api"
            : "Informasi"}
        </span>
      </div>

      {/* Connected Satellite Cluster (if tagged) */}
      {post.clusterCode && (
        <div>
          <Link
            to="/map"
            search={{ area: post.clusterCode }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 bg-brand-50/80 hover:bg-brand-100/80 border border-brand-200/70 px-2.5 py-1 rounded-lg transition"
          >
            <Compass className="w-3.5 h-3.5 text-brand-600" />
            <span>Satelit NASA: {post.clusterCode}</span>
            <ArrowRight className="w-3 h-3 text-brand-500" />
          </Link>
        </div>
      )}

      {/* Content Text */}
      <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line font-normal">
        {post.content}
      </p>

      {/* Media Bukti (Foto atau Video) */}
      {post.imageUrl && (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-black aspect-video sm:aspect-[16/10] flex items-center justify-center group">
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
    </article>
  );
}
