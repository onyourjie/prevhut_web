import React, { useState, useRef, useEffect, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { apiRequest } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { uploadMediaToCloudinary } from "@/lib/cloudinary";
import { showSuccessToast, showErrorToast } from "@/lib/swal";
import { getRegencyCoordinates, isInsideKalimantan } from "@/lib/kalimantan-locations";
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
  const [specificLocation, setSpecificLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Review & Confirmation Modals
  const [showEmergencyHelpPrompt, setShowEmergencyHelpPrompt] = useState(false);
  const [showPublishConfirmation, setShowPublishConfirmation] = useState(false);

  // TanStack Query untuk kuota pelaporan harian (otomatis cache & deduplikasi 1 kali fetch)
  const {
    data: quota,
    isLoading: isLoadingQuota,
    isError: quotaError,
    refetch: refetchQuota,
  } = useQuery<{
    role: string;
    postsToday: number;
    maxDaily: number;
    remainingQuota: number;
    canPost: boolean;
  }>({
    queryKey: ['user-quota', user?.id],
    queryFn: () => apiRequest('/community/quota'),
    enabled: isAuthenticated && !!user?.id,
  });

  const quotaBlocked = isAuthenticated && (isLoadingQuota || quotaError || quota?.canPost !== true);

  // Ambil data klaster satelit NASA FIRMS untuk deteksi spasial dan fallback wilayah kabupaten
  const { data: clusters = [] } = useQuery<any[]>({
    queryKey: ["hotspots-clusters-simple"],
    queryFn: () => apiRequest<any[]>("/hotspots/clusters"),
    staleTime: 1000 * 60 * 5,
  });

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

  // Deteksi klaster satelit terhubung (Spasial < 20km atau Fallback Kabupaten yang sama)
  const clusterDetection = useMemo(() => {
    if (category !== "DARURAT" || !Array.isArray(clusters) || clusters.length === 0) return null;

    const haversineDist = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371.0;
      const dLat = ((lat2 - lat1) * Math.PI) / 180.0;
      const dLon = ((lon2 - lon1) * Math.PI) / 180.0;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180.0) *
          Math.cos((lat2 * Math.PI) / 180.0) *
          Math.sin(dLon / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    // 1. Prioritas Utama: Radius spasial <= 20 km jika koordinat valid
    if (typeof latitude === "number" && typeof longitude === "number") {
      let closest = null;
      let minDist = Infinity;
      for (const c of clusters) {
        if (typeof c.centroid?.latitude === "number" && typeof c.centroid?.longitude === "number") {
          const d = haversineDist(c.centroid.latitude, c.centroid.longitude, latitude, longitude);
          if (d < minDist) {
            minDist = d;
            closest = c;
          }
        }
      }
      if (closest && minDist <= 20.0) {
        return { cluster: closest, isFallback: false };
      }
    }

    // 2. Fallback Wilayah Administratif: Jika di luar 20 km (misal testing dari Jawa / tanpa GPS),
    // cocokkan secara otomatis dengan klaster aktif di Kabupaten yang sama
    if (kabupaten) {
      const cleanKab = kabupaten.toLowerCase().replace(/^(kabupaten|kota)\s+/i, "").trim();
      const inKab = clusters.filter((c) => {
        const cKab = (c.kabupaten || "").toLowerCase().replace(/^(kabupaten|kota)\s+/i, "").trim();
        return cKab === cleanKab || (cKab && cleanKab && (cKab.includes(cleanKab) || cleanKab.includes(cKab)));
      });
      if (inKab.length > 0) {
        return { cluster: inKab[0], isFallback: true };
      }
    }

    return null;
  }, [category, clusters, latitude, longitude, kabupaten]);

  const previewCluster = clusterDetection?.cluster ?? null;
  const isClusterFallback = clusterDetection?.isFallback ?? false;


  // Format alamat lengkap: patokan lapangan spesifik (jika ada) + kecamatan, kabupaten, provinsi
  const assembledAddress = [
    specificLocation.trim(),
    kecamatan,
    kabupaten,
    province,
  ]
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
      const res = await refetchQuota();
      const latestQuota = res.data;
      if (!latestQuota?.canPost) {
        setShowPublishConfirmation(false);
        if (latestQuota) showErrorToast("Batas kuota harian tercapai");
        return;
      }
      // Deteksi klaster satelit FIRMS (Spasial <20km atau Fallback Wilayah Kabupaten)
      let detectedClusterCode: string | undefined = undefined;
      let finalLat = latitude;
      let finalLng = longitude;

      if (category === "DARURAT" && previewCluster) {
        detectedClusterCode = previewCluster.code || previewCluster.name;
        // Pertahankan koordinat presisi pelapor jika berada dalam radius spasial klaster (<= 20 km).
        // Ganti ke koordinat centroid klaster HANYA jika titik pelapor adalah fallback administratif
        // (misal user di luar radius atau di luar Kalimantan dan dicocokkan via nama kabupaten).
        const isOutsideKalimantan = !isInsideKalimantan(latitude, longitude);
        if (
          (isClusterFallback || isOutsideKalimantan) &&
          previewCluster.centroid?.latitude &&
          previewCluster.centroid?.longitude
        ) {
          finalLat = previewCluster.centroid.latitude;
          finalLng = previewCluster.centroid.longitude;
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
          latitude: finalLat,
          longitude: finalLng,
          province,
          kabupaten,
          kecamatan,
          clusterCode: detectedClusterCode,
        }),
      });

      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      queryClient.invalidateQueries({ queryKey: ['user-quota'] });

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

          {/* 4. Lokasi Laporan (Sesuai Profil & Patokan Lapangan) */}
          <CreateLocationSection
            province={province}
            kabupaten={kabupaten}
            kecamatan={kecamatan}
            latitude={latitude}
            longitude={longitude}
            specificLocation={specificLocation}
            onSpecificLocationChange={setSpecificLocation}
            detectedClusterCode={previewCluster?.code || previewCluster?.name}
          />

          {quotaError && (
            <div role="alert" className="p-3 rounded-xl bg-red-50 text-red-800 text-xs space-y-2">
              <p>Gagal memuat kuota postingan. Coba lagi sebelum melanjutkan.</p>
              <button type="button" onClick={() => void refetchQuota()} disabled={isLoadingQuota} className="font-bold underline cursor-pointer">
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
