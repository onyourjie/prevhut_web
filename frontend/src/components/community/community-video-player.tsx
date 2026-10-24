import { useEffect, useRef, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface CommunityVideoPlayerProps {
  src: string;
  className?: string;
  containerClassName?: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export function CommunityVideoPlayer({
  src,
  className = "w-full h-full object-contain",
  containerClassName = "relative w-full h-full flex items-center justify-center bg-black overflow-hidden group",
  autoPlay = false,
  muted = false,
  controls = true,
}: CommunityVideoPlayerProps) {
  const [playableSrc, setPlayableSrc] = useState<string>("");
  const [loadError, setLoadError] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!src) {
      setPlayableSrc("");
      return;
    }

    setLoadError(false);
    let blobUrlToRevoke = "";
    let isCancelled = false;

    // Jika source berupa data: URL base64, kita ubah ke Blob Object URL
    // karena Chromium dan Safari tidak bisa streaming/seeking data: URL berukuran besar
    if (src.startsWith("data:video/")) {
      fetch(src)
        .then((res) => res.blob())
        .then((blob) => {
          if (!isCancelled) {
            blobUrlToRevoke = URL.createObjectURL(blob);
            setPlayableSrc(blobUrlToRevoke);
          }
        })
        .catch((err) => {
          console.warn("Fallback data URL to blob error:", err);
          if (!isCancelled) {
            setPlayableSrc(src);
          }
        });
    } else {
      setPlayableSrc(src);
    }

    return () => {
      isCancelled = true;
      if (blobUrlToRevoke) {
        URL.revokeObjectURL(blobUrlToRevoke);
      }
    };
  }, [src]);

  return (
    <div className={containerClassName}>
      {playableSrc && (
        <video
          ref={videoRef}
          src={playableSrc}
          controls={controls}
          playsInline
          preload="auto"
          muted={muted}
          autoPlay={autoPlay}
          onError={() => setLoadError(true)}
          className={className}
        />
      )}

      {loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/90 text-white p-4 text-center gap-2 z-10">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <span className="text-xs font-semibold">Video tidak dapat dimuat</span>
          <button
            type="button"
            onClick={() => {
              setLoadError(false);
              if (videoRef.current) {
                videoRef.current.load();
                videoRef.current.play().catch(() => {});
              }
            }}
            className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}
    </div>
  );
}
