import { useEffect } from "react";
import { X, ExternalLink, MapPin, AlertTriangle, Info } from "lucide-react";
import { CommunityVideoPlayer } from "./community-video-player";
import { isVideoMedia } from "@/lib/cloudinary";

interface MediaLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  category?: "DARURAT" | "INFORMASI";
  authorName?: string;
  authorRole?: string;
  address?: string;
  dateStr?: string;
  isLiveCamera?: boolean;
}

export function MediaLightboxModal({
  isOpen,
  onClose,
  mediaUrl,
  category = "DARURAT",
  authorName,
  authorRole,
  address,
  dateStr,
  isLiveCamera: _isLiveCamera = true,
}: MediaLightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mediaUrl) return null;

  const isVideo = isVideoMedia(mediaUrl);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div
        className="w-full p-4 sm:px-6 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1.5 border ${
              category === "DARURAT"
                ? "bg-red-500/20 text-red-400 border-red-500/40"
                : "bg-teal-500/20 text-teal-300 border-teal-500/40"
            }`}
          >
            {category === "DARURAT" ? (
              <AlertTriangle className="w-3.5 h-3.5" />
            ) : (
              <Info className="w-3.5 h-3.5" />
            )}
            <span>{category === "DARURAT" ? "Titik Api Darurat" : "Informasi Lapangan"}</span>
          </span>

          {authorName && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-300">
              <span className="font-bold text-white">{authorName}</span>
              {authorRole && (
                <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-[10px] text-neutral-400 font-semibold">
                  {authorRole}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Open full media in new tab if not blob */}
          {!mediaUrl.startsWith("blob:") && !mediaUrl.startsWith("data:") && (
            <a
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition"
              title="Buka Media Asli"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-white transition cursor-pointer"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Center Media Area (Uncropped original view) */}
      <div
        className="flex-1 w-full flex items-center justify-center p-3 sm:p-6 overflow-hidden"
        onClick={onClose}
      >
        <div
          className="relative max-w-5xl max-h-[78vh] w-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {isVideo ? (
            <div className="w-full max-h-[78vh] rounded-2xl overflow-hidden shadow-2xl bg-black flex items-center justify-center">
              <CommunityVideoPlayer
                src={mediaUrl}
                controls
                autoPlay
                className="max-h-[78vh] max-w-full object-contain"
              />
            </div>
          ) : (
            <img
              src={mediaUrl}
              alt="Media kondisi riil lapangan"
              className="max-h-[78vh] max-w-full object-contain rounded-2xl shadow-2xl select-none"
            />
          )}
        </div>
      </div>

      {/* Bottom Information Footer */}
      <div
        className="w-full p-4 sm:px-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-neutral-300 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {address ? (
          <div className="flex items-center gap-1.5 max-w-xl truncate">
            <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="truncate font-medium">{address}</span>
          </div>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3 shrink-0">
          {dateStr && <span className="text-neutral-400 font-medium">{dateStr}</span>}
        </div>
      </div>
    </div>
  );
}
