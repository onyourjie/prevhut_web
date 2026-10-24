import React, { useState, useRef } from "react";
import { X, Camera, AlertCircle, RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { uploadMediaToCloudinary, isVideoMedia } from "@/lib/cloudinary";
import { CommunityVideoPlayer } from "@/components/community/community-video-player";
import { showSuccessToast, showErrorToast } from "@/lib/swal";

export interface UpdateModalProps {
  postId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export function UpdateModal({ postId, onSuccess, onClose }: UpdateModalProps) {
  const { user } = useAuthStore();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const uploadedUrl = await uploadMediaToCloudinary(file, "firezone_updates");
      setImageUrl(uploadedUrl);
      // Tidak menampilkan toast di sini, cukup saat postingan berhasil disubmit
    } catch (err: any) {
      showErrorToast(err.message || "Gagal memproses file media");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      showErrorToast("Deskripsi perkembangan wajib diisi");
      return;
    }

    try {
      setIsSubmitting(true);
      await apiRequest(`/community/posts/${postId}/updates`, {
        method: "POST",
        body: JSON.stringify({
          content: content.trim(),
          imageUrl: imageUrl || undefined,
        }),
      });

      showSuccessToast("Update kondisi lapangan berhasil dibagikan");
      onSuccess();
      onClose();
    } catch (err: any) {
      showErrorToast(err.message || "Gagal menambahkan update pengirim");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Header */}
        <div className="p-5 pb-3 flex items-center justify-between border-b border-neutral-100">
          <div>
            <h2 className="text-base font-extrabold text-neutral-900 leading-tight">
              Tambah Perkembangan
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Bagikan foto, rekaman video, atau status pemadaman terkini dari lapangan.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-left">
          {/* Author Badge */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <img
              src={
                user?.avatarUrl ||
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80"
              }
              alt={user?.name || "Pengguna"}
              className="w-8 h-8 rounded-full object-cover border border-neutral-300"
            />
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-neutral-900">
                {user?.name || "Pelapor"}
              </span>
              <span className="text-neutral-400">•</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-orange-100 text-orange-800 border border-orange-200">
                Pengirim
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-800">
              Deskripsi Kondisi Lapangan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Contoh: Petugas sudah tiba di lokasi dan mulai melakukan pemadaman. Asap mulai menipis..."
              rows={4}
              required
              className="w-full text-xs p-3 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none leading-relaxed"
            />
          </div>

          {/* Media Attachment (Foto / Video) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-800">
              Bukti Foto / Video Perkembangan (Opsional)
            </label>

            {imageUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-neutral-200 group bg-black">
                {isVideoMedia(imageUrl) ? (
                  <CommunityVideoPlayer
                    src={imageUrl}
                    className="w-full h-44 object-cover"
                  />
                ) : (
                  <img
                    src={imageUrl}
                    alt="Update kondisi"
                    className="w-full h-44 object-cover"
                  />
                )}
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-xs font-bold text-neutral-900 backdrop-blur-xs transition flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Ganti Media</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="px-2.5 py-1 rounded-lg bg-red-600 text-xs font-bold text-white hover:bg-red-700 transition shadow-sm cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 border-2 border-dashed border-neutral-300 hover:border-brand-500 rounded-xl bg-neutral-50 hover:bg-brand-50/30 flex flex-col items-center justify-center cursor-pointer transition text-center"
              >
                <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-brand-600 mb-2">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-neutral-800">
                  {isUploading ? "Mengunggah Media..." : "Pilih Foto / Video Lapangan"}
                </span>
                <span className="text-[11px] text-neutral-500 mt-0.5">
                  Unggah foto atau rekaman video langsung dari perangkat
                </span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Verification Banner */}
            <div className="p-2.5 rounded-xl bg-neutral-100 text-neutral-600 text-[11px] flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <span>Media ini akan diverifikasi dan disematkan pada kronologi postingan Anda.</span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-[0.99] disabled:opacity-50 transition shadow-sm cursor-pointer"
            >
              {isSubmitting ? "Mempublikasikan Update..." : "Bagikan Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
