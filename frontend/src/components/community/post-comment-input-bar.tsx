import React, { useRef } from "react";
import { Camera, Paperclip, Send, RefreshCw, Video, X } from "lucide-react";
import { LiveCameraViewfinder } from "@/components/camera/live-camera-viewfinder";
import { isVideoMedia } from "@/lib/cloudinary";

interface PostCommentInputBarProps {
  commentText: string;
  setCommentText: (text: string) => void;
  commentImage: string;
  setCommentImage: (url: string) => void;
  commentMediaType: "video" | "image" | null;
  setCommentMediaType: (type: "video" | "image" | null) => void;
  isCameraOpen: boolean;
  setIsCameraOpen: (open: boolean) => void;
  isUploadingMedia: boolean;
  isSubmittingComment: boolean;
  onSendComment: (e: React.FormEvent) => void;
  onCameraCaptured: (file: File) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PostCommentInputBar({
  commentText,
  setCommentText,
  commentImage,
  setCommentImage,
  commentMediaType,
  setCommentMediaType,
  isCameraOpen,
  setIsCameraOpen,
  isUploadingMedia,
  isSubmittingComment,
  onSendComment,
  onCameraCaptured,
  onFileChange,
}: PostCommentInputBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="fixed bottom-16 lg:bottom-0 left-0 lg:left-72 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-2.5 sm:p-4 shadow-md lg:shadow-xs">
        <form
          onSubmit={onSendComment}
          className="max-w-2xl mx-auto flex flex-col gap-2"
        >
          {commentImage && (
            <div className="relative inline-flex items-center gap-2 p-1.5 rounded-xl bg-neutral-100 border border-neutral-200 w-fit animate-in fade-in">
              <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-neutral-300 bg-black flex items-center justify-center shrink-0">
                {commentMediaType === "video" || isVideoMedia(commentImage) ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <video
                      src={commentImage}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Video className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={commentImage}
                    alt="Lampiran komentar"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="text-[11px] pr-2">
                <span className="font-bold text-neutral-800 block">
                  {commentMediaType === "video" || isVideoMedia(commentImage)
                    ? "Video Terlampir"
                    : "Foto Terlampir"}
                </span>
                <span className="text-[10px] text-neutral-500">
                  Siap dikirim bersama komentar
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCommentImage("");
                  setCommentMediaType(null);
                }}
                className="w-5 h-5 rounded-full bg-neutral-200 hover:bg-red-600 hover:text-white text-neutral-700 flex items-center justify-center text-xs transition cursor-pointer"
                title="Hapus lampiran"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {isUploadingMedia && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold w-fit animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Mengunggah media komentar...</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 sm:gap-2">
            <input
              type="text"
              placeholder="Tulis komentar atau kondisi terkini..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 text-xs py-2.5 px-3.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />

            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              disabled={isUploadingMedia}
              className="w-9 h-9 rounded-xl border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 flex items-center justify-center transition shrink-0 cursor-pointer disabled:opacity-50"
              title="Buka Kamera / Perekam Video Langsung"
              aria-label="Kamera dan Video Langsung"
            >
              <Camera className="w-4 h-4 text-neutral-800" />
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingMedia}
              className="w-9 h-9 rounded-xl border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 flex items-center justify-center transition shrink-0 cursor-pointer disabled:opacity-50"
              title="Unggah Foto atau Video dari Perangkat"
              aria-label="Pilih File / Galeri"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="submit"
              disabled={isSubmittingComment || !commentText.trim()}
              className="w-9 h-9 rounded-xl bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center disabled:opacity-40 transition shadow-sm shrink-0 cursor-pointer"
              title="Kirim Komentar"
            >
              {isSubmittingComment ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={onFileChange}
              className="hidden"
            />
          </div>
        </form>
      </div>

      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-lg h-full sm:h-auto sm:max-h-[90vh] bg-black sm:rounded-3xl overflow-hidden relative shadow-2xl">
            <LiveCameraViewfinder
              onCapture={onCameraCaptured}
              onClose={() => setIsCameraOpen(false)}
              isUploading={isUploadingMedia}
            />
          </div>
        </div>
      )}
    </>
  );
}
