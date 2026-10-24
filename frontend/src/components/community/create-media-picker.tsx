import React, { type RefObject } from "react";
import { Camera, Video, Upload, RefreshCw } from "lucide-react";
import { LiveCameraViewfinder } from "@/components/camera/live-camera-viewfinder";
import { CommunityVideoPlayer } from "@/components/community/community-video-player";
import { isVideoMedia } from "@/lib/cloudinary";

interface CreateMediaPickerProps {
  imageUrl: string;
  previewUrl: string;
  mediaType: "video" | "image" | null;
  isCameraOpen: boolean;
  isUploading: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onOpenLiveCamera: () => void;
  onCloseLiveCamera: () => void;
  onCameraCaptured: (file: File) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearMedia: () => void;
  onPreviewClick: () => void;
}

export function CreateMediaPicker({
  imageUrl,
  previewUrl,
  mediaType,
  isCameraOpen,
  isUploading,
  fileInputRef,
  onOpenLiveCamera,
  onCloseLiveCamera,
  onCameraCaptured,
  onFileChange,
  onClearMedia,
  onPreviewClick,
}: CreateMediaPickerProps) {
  const isVideo = mediaType === "video" || isVideoMedia(imageUrl);
  const activeMediaSrc = previewUrl || imageUrl;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold text-neutral-800">
            Foto / Video Lapangan <span className="text-red-500">*</span>
          </label>
          <span className="text-[11px] text-neutral-500 block">
            Kamera langsung otomatis merekam bukti riil di lapangan
          </span>
        </div>
        {!isCameraOpen && !imageUrl && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[11px] text-neutral-700 hover:text-neutral-900 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-neutral-600" />
            <span>Pilih File Media</span>
          </button>
        )}
      </div>

      {/* A. Sedang Buka Viewfinder Kamera Langsung */}
      {isCameraOpen ? (
        <LiveCameraViewfinder
          onCapture={onCameraCaptured}
          onClose={onCloseLiveCamera}
          isUploading={isUploading}
        />
      ) : imageUrl ? (
        /* B. Foto atau Video Sudah Ada */
        <div className="relative rounded-2xl overflow-hidden border border-neutral-300 bg-black aspect-video flex items-center justify-center shadow-xs group">
          {isVideo ? (
            <CommunityVideoPlayer
              src={activeMediaSrc}
              className="w-full h-full object-contain bg-black"
            />
          ) : (
            <img
              src={activeMediaSrc}
              alt="Bukti Kejadian"
              onClick={onPreviewClick}
              className="w-full h-full object-contain bg-neutral-950 cursor-pointer"
            />
          )}

          {/* Action buttons on top right */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            <button
              type="button"
              onClick={onOpenLiveCamera}
              className="px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-black text-white text-xs font-bold backdrop-blur-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isVideo ? "Rekam Ulang" : "Ambil Ulang"}</span>
            </button>
            <button
              type="button"
              onClick={onClearMedia}
              className="px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black text-white text-xs font-semibold backdrop-blur-xs transition cursor-pointer"
            >
              Hapus
            </button>
          </div>
        </div>
      ) : (
        /* C. Tombol Buka Kamera Utama */
        <div className="space-y-2">
          <button
            type="button"
            onClick={onOpenLiveCamera}
            className="w-full py-5 px-4 rounded-2xl border-2 border-dashed border-neutral-300 hover:border-neutral-400 bg-neutral-50/60 hover:bg-neutral-100/80 transition flex flex-col items-center justify-center gap-2 group cursor-pointer shadow-2xs"
          >
            {isUploading ? (
              <RefreshCw className="w-7 h-7 animate-spin text-neutral-900 my-1" />
            ) : (
              <div className="flex items-center gap-2 text-neutral-900 group-hover:scale-105 transition py-1">
                <Camera className="w-6 h-6 text-neutral-900 stroke-[2.2]" />
                <span className="text-sm text-neutral-400 font-bold">/</span>
                <Video className="w-6 h-6 text-neutral-900 stroke-[2.2]" />
              </div>
            )}
            <div className="text-center">
              <span className="text-xs font-extrabold text-neutral-900 block">
                {isUploading ? "Mengunggah Media..." : "Buka Kamera / Perekam Lapangan"}
              </span>
              <span className="text-[11px] text-neutral-500 block mt-0.5">
                Bisa ambil foto jepret langsung atau rekam video singkat 30 detik
              </span>
            </div>
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={onFileChange}
        className="hidden"
      />
    </div>
  );
}
