import React, { useState, useRef, useEffect, useCallback } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { apiRequest } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { uploadMediaToCloudinary } from "@/lib/cloudinary";
import { showSuccessToast, showErrorToast } from "@/lib/swal";
import { getRegencyCoordinates } from "@/lib/kalimantan-locations";
import { EmergencyPromptModal } from "@/components/community/emergency-prompt-modal";
import { PublishConfirmationModal } from "@/components/community/publish-confirmation-modal";
import { CreateMediaPicker } from "@/components/community/create-media-picker";
import { CreateLocationSection } from "@/components/community/create-location-section";
import { CreateCategorySelector } from "@/components/community/create-category-selector";
import { MediaLightboxModal } from "@/components/community/media-lightbox-modal";

export const Route = createFileRoute("/community/create")({
  component: CreatePostPage,
});

function CreatePostPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      showErrorToast("Silakan masuk terlebih dahulu untuk membuat laporan titik api");
      navigate({ to: "/login" });
    }
  }, [hasHydrated, isAuthenticated, navigate]);

  const [category, setCategory] = useState<"DARURAT" | "INFORMASI">("DARURAT");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quota, setQuota] = useState<{
    role: string;
    postsToday: number;
    maxDaily: number;
    remainingQuota: number;
    canPost: boolean;
  } | null>(null);

  const [quotaError, setQuotaError] = useState(false);
  const [isLoadingQuota, setIsLoadingQuota] = useState(false);

  // Review & Confirmation Modals
  const [showEmergencyHelpPrompt, setShowEmergencyHelpPrompt] = useState(false);
  const [showPublishConfirmation, setShowPublishConfirmation] = useState(false);

  const loadQuota = useCallback(async () => {
    setIsLoadingQuota(true);
    setQuotaError(false);
    try {
      const data = await apiRequest<NonNullable<typeof quota>>("/community/quota", { cache: "no-store" });
      setQuota(data);
      if (!data.canPost) {
        setShowPublishConfirmation(false);
        setShowEmergencyHelpPrompt(false);
      }
      return data;
    } catch {
      setQuota(null);
      setQuotaError(true);
      setShowPublishConfirmation(false);
      setShowEmergencyHelpPrompt(false);
      return null;
    } finally {
      setIsLoadingQuota(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) void loadQuota();
  }, [isAuthenticated, loadQuota]);

  const quotaBlocked = isAuthenticated && (isLoadingQuota || quotaError || quota?.canPost !== true);

  // Lokasi otomatis mengikuti profil akun
  const [province, setProvince] = useState(user?.province || "Kalimantan Barat");
  const [kabupaten, setKabupaten] = useState(user?.kabupaten || "Kabupaten Sintang");
  const [kecamatan, setKecamatan] = useState(user?.kecamatan ?? (user?.kabupaten ? "" : "Kecamatan Sintang"));
  const [latitude, setLatitude] = useState(
    typeof user?.latitude === "number" && user.latitude !== 0 ? user.latitude : -0.1255
  );
  const [longitude, setLongitude] = useState(
    typeof user?.longitude === "number" && user.longitude !== 0 ? user.longitude : 111.4822
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sinkronisasi otomatis dari profil saat mount / update
  useEffect(() => {
    if (user) {
      if (user.province) setProvince(user.province);
      if (user.kabupaten) setKabupaten(user.kabupaten);
      if (user.kecamatan) setKecamatan(user.kecamatan);

      if (typeof user.latitude === "number" && user.latitude !== 0) {
        setLatitude(user.latitude);
      } else {
        const coords = getRegencyCoordinates(
          user.province || "Kalimantan Barat",
          user.kabupaten || "Kabupaten Sintang"
        );
        setLatitude(coords.lat);
        setLongitude(coords.lng);
      }

      if (typeof user.longitude === "number" && user.longitude !== 0) {
        setLongitude(user.longitude);
      }
    }
  }, [user]);

  const processUploadMedia = async (file: File, isFromCamera = false) => {
    try {
      setIsUploading(true);
      const isVideo = file.type.startsWith("video/");
      setMediaType(isVideo ? "video" : "image");
      setPreviewUrl(URL.createObjectURL(file));
      const url = await uploadMediaToCloudinary(file, "firezone_community");
      setImageUrl(url);
      if (isFromCamera) setIsCameraOpen(false);
    } catch (err: any) {
      showErrorToast(err.message || "Gagal mengunggah media");
    } finally {
      setIsUploading(false);
    }
  };

  // Format alamat lengkap dari profil
  const assembledAddress = [kecamatan, kabupaten, province]
    .filter(Boolean)
    .join(", ");

  const handleReviewClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (quotaBlocked) return;
    if (!content.trim()) {
      showErrorToast("Deskripsi kondisi kejadian wajib diisi");
      return;
    }

    if (category === "DARURAT") {
      setShowEmergencyHelpPrompt(true);
    } else {
      setShowPublishConfirmation(true);
    }
  };

  const handleProceedEmergency = () => {
    setShowEmergencyHelpPrompt(false);
    if (!quotaBlocked) setShowPublishConfirmation(true);
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    if (!isAuthenticated) {
      showErrorToast("Silakan masuk terlebih dahulu untuk mempublikasikan laporan");
      navigate({ to: "/login" });
      return;
    }

    if (quotaBlocked) {
      setShowPublishConfirmation(false);
      return;
    }

    try {
      setIsSubmitting(true);
      const latestQuota = await loadQuota();
      if (!latestQuota?.canPost) {
        setShowPublishConfirmation(false);
        if (latestQuota) showErrorToast("Batas kuota harian tercapai");
        return;
      }
      // Deteksi kluster satelit FIRMS terdekat secara spasial & wilayah jika laporan DARURAT
      let detectedClusterCode: string | undefined = undefined;
      if (category === "DARURAT") {
        try {
          const clusters = await apiRequest<any[]>("/hotspots/clusters");
          if (Array.isArray(clusters) && clusters.length > 0 && typeof latitude === "number" && typeof longitude === "number") {
            const haversineDist = (lat1: number, lon1: number, lat2: number, lon2: number) => {
              const R = 6371.0;
              const dLat = ((lat2 - lat1) * Math.PI) / 180.0;
              const dLon = ((lon2 - lon1) * Math.PI) / 180.0;
              const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((lat1 * Math.PI) / 180.0) *
                  Math.cos((lat2 * Math.PI) / 180.0) *
                  Math.sin(dLon / 2) *
                  Math.sin(dLon / 2);
              return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            };

            let closestCluster = null;
            let minDistanceKm = Infinity;
            for (const c of clusters) {
              const cLat = c.centroid?.latitude;
              const cLng = c.centroid?.longitude;
              if (typeof cLat === "number" && typeof cLng === "number") {
                const distKm = haversineDist(cLat, cLng, latitude, longitude);
                if (distKm < minDistanceKm) {
                  minDistanceKm = distKm;
                  closestCluster = c;
                }
              }
            }
            // Radius maksimal 20 km dari centroid klaster satelit
            if (closestCluster && minDistanceKm <= 20.0) {
              detectedClusterCode = closestCluster.code || closestCluster.name;
            }
          }
        } catch (e) {
          console.warn("Could not match hotspot cluster:", e);
        }
      }

      await apiRequest("/community/posts", {
        method: "POST",
        body: JSON.stringify({
          category,
          content: content.trim(),
          imageUrl: imageUrl || "https://images.unsplash.com/photo-1542385151-efd9000785a0?w=800",
          isLiveCamera: true,
          address: assembledAddress,
          latitude,
          longitude,
          province,
          kabupaten,
          kecamatan,
          clusterCode: detectedClusterCode,
        }),
      });

      showSuccessToast(
        category === "DARURAT"
          ? "Postingan darurat berhasil dipublikasikan dan disematkan di posisi teratas!"
          : "Informasi berhasil dibagikan ke komunitas!"
      );

      navigate({ to: "/community" });
    } catch (err: any) {
      showErrorToast(err.message || "Gagal mempublikasikan postingan");
    } finally {
      setIsSubmitting(false);
      setShowPublishConfirmation(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppLayout title="Buat Laporan Titik Api">
      <div className="max-w-2xl mx-auto space-y-6 pb-20">
        {/* Navigation Back */}
        <div className="flex items-center gap-3">
          <Link
            to="/community"
            className="w-9 h-9 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-extrabold text-neutral-900 leading-tight">
              Lapor Temuan Titik Api
            </h1>
            <p className="text-[11px] text-neutral-500 font-medium">
              Verifikasi visual kamera & lokasi kejadian
            </p>
          </div>
        </div>

        <form onSubmit={handleReviewClick} className="space-y-6">
          {/* 1. Pilih Kategori Laporan */}
          <CreateCategorySelector
            category={category}
            onSelectCategory={setCategory}
          />

          {/* 2. Foto atau Video Lapangan */}
          <CreateMediaPicker
            imageUrl={imageUrl}
            previewUrl={previewUrl}
            mediaType={mediaType}
            isCameraOpen={isCameraOpen}
            isUploading={isUploading}
            fileInputRef={fileInputRef}
            onOpenLiveCamera={() => setIsCameraOpen(true)}
            onCloseLiveCamera={() => setIsCameraOpen(false)}
            onCameraCaptured={(f) => processUploadMedia(f, true)}
            onFileChange={(e) => { const f = e.target.files?.[0]; if (f) processUploadMedia(f, false); }}
            onClearMedia={() => {
              setImageUrl("");
              setPreviewUrl("");
              setMediaType(null);
            }}
            onPreviewClick={() => setShowLightbox(true)}
          />

          {/* 3. Deskripsi Kondisi */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800">
              Deskripsi Kondisi <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Jelaskan apa yang kamu lihat, perkiraan luas api, arah tiupan angin, dan apakah mendekati permukiman warga..."
              rows={4}
              required
              className="w-full text-xs p-3.5 rounded-xl border border-neutral-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none leading-relaxed"
            />
          </div>

          {/* 4. Lokasi Laporan (Sesuai Profil) */}
          <CreateLocationSection
            province={province}
            kabupaten={kabupaten}
            kecamatan={kecamatan}
            latitude={latitude}
            longitude={longitude}
          />

          {quotaError && (
            <div role="alert" className="p-3 rounded-xl bg-red-50 text-red-800 text-xs space-y-2">
              <p>Gagal memuat kuota postingan. Coba lagi sebelum melanjutkan.</p>
              <button type="button" onClick={() => void loadQuota()} disabled={isLoadingQuota} className="font-bold underline cursor-pointer">
                Coba lagi
              </button>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={quotaBlocked || isSubmitting}
              className={`w-full py-3.5 rounded-xl text-xs font-extrabold text-white transition shadow-md active:scale-[0.99] ${
                (quotaBlocked || isSubmitting)
                  ? "bg-neutral-400 cursor-not-allowed"
                  : "bg-brand-600 hover:bg-brand-700 cursor-pointer"
              }`}
              style={quotaBlocked || isSubmitting ? { backgroundColor: "#9ca3af" } : { backgroundColor: "#eb5314" }}
            >
              {isLoadingQuota ? "Memuat kuota..." : quotaError ? "Kuota tidak tersedia" : quota?.canPost === false
                ? "Batas Kuota Harian Tercapai (Maks 3x/Hari)"
                : "Tinjau Postingan"}
            </button>
          </div>
        </form>
      </div>

      {/* Modals */}
      <EmergencyPromptModal
        isOpen={showEmergencyHelpPrompt}
        onProceed={handleProceedEmergency}
      />

      <PublishConfirmationModal
        isOpen={showPublishConfirmation && (!isAuthenticated || quota?.canPost === true) && !quotaError}
        category={category}
        isSubmitting={isSubmitting}
        onConfirm={handleFinalSubmit}
        onCancel={() => setShowPublishConfirmation(false)}
      />
    
      {/* Lightbox Modal Fullscreen */}
      <MediaLightboxModal
        isOpen={showLightbox}
        onClose={() => setShowLightbox(false)}
        mediaUrl={previewUrl || imageUrl}
        category={category}
        authorName={user?.name || "Pelapor"}
        authorRole={user?.role || "Warga"}
        address={assembledAddress}
        isLiveCamera={true}
      />
    </AppLayout>
  );
}
