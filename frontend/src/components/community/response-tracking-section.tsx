import {
  CheckCircle2,
  Clock,
  Truck,
  Activity,
} from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

interface ResponseTrackingSectionProps {
  post: any;
  onMediaClick?: (url: string) => void;
  onOpenAssign?: (post: any) => void;
}

export function ResponseTrackingSection({
  post,
  onMediaClick,
  onOpenAssign,
}: ResponseTrackingSectionProps) {
  const { user } = useAuthStore();
  const assignments = post.assignments || [];
  const latestAssignment = assignments[0] || null;

  // Real-time calculation of response and duration times
  let responseTimeText = "Menunggu Disposisi";
  let hasResponseTime = false;
  if (latestAssignment?.createdAt) {
    hasResponseTime = true;
    const diffMs =
      new Date(latestAssignment.createdAt).getTime() -
      new Date(post.createdAt).getTime();
    const diffMinutes = Math.max(1, Math.round(diffMs / 60000));
    if (diffMinutes < 60) {
      responseTimeText = `${diffMinutes} Menit`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const remainingMinutes = diffMinutes % 60;
      responseTimeText = remainingMinutes > 0 ? `${hours}j ${remainingMinutes}m` : `${hours} Jam`;
    }
  }

  let durationText = "Belum Dimulai";
  if (post.status === "SELESAI") {
    if (latestAssignment?.completedAt) {
      const durationMs =
        new Date(latestAssignment.completedAt).getTime() -
        new Date(latestAssignment.createdAt).getTime();
      const durMinutes = Math.max(1, Math.round(durationMs / 60000));
      if (durMinutes < 60) {
        durationText = `${durMinutes} Menit`;
      } else {
        const hours = Math.floor(durMinutes / 60);
        const rem = durMinutes % 60;
        durationText = rem > 0 ? `${hours}j ${rem}m` : `${hours} Jam`;
      }
    } else {
      durationText = "Tuntas";
    }
  } else if (post.status === "DALAM_PENANGANAN") {
    durationText = "Sedang Berjalan";
  }

  // Determine stage and step details
  const isSelesai = post.status === "SELESAI";
  const isDalamPenanganan = post.status === "DALAM_PENANGANAN";
  const isMenungguVerifikasi = post.status === "MENUNGGU_VERIFIKASI";

  // Helper status relawan
  let volunteerStatusLabel = "Siaga Wilayah";
  if (latestAssignment) {
    switch (latestAssignment.status) {
      case "ASSIGNED":
        volunteerStatusLabel = "Menunggu Respon";
        break;
      case "ACCEPTED":
        volunteerStatusLabel = "Siap Meluncur";
        break;
      case "ON_THE_WAY":
        volunteerStatusLabel = "Menuju Lokasi";
        break;
      case "ON_SITE":
        volunteerStatusLabel = "Di Lokasi Api";
        break;
      case "COMPLETED":
        volunteerStatusLabel = "Tuntas Bertugas";
        break;
      case "REJECTED":
        volunteerStatusLabel = "Ditolak Relawan";
        break;
      default:
        volunteerStatusLabel = "Terdisposisi";
    }
  }

  // Dynamic 5-step progression timeline
  const step1 = {
    num: 1,
    title: "Laporan Diterima",
    desc: "Laporan darurat warga tercatat di sistem Fireline",
    time: formatTimeAgo(post.createdAt),
    done: true,
    active: false,
  };

  const step2 = {
    num: 2,
    title: "Verifikasi Posko & AI",
    desc:
      isMenungguVerifikasi
        ? post.clusterCode
          ? `Terdeteksi di ${post.clusterCode} (Satelit FIRMS). Menunggu validasi admin posko.`
          : "Menunggu validasi visual kamera & koordinat GPS oleh petugas Posko BPBD."
        : post.clusterCode
        ? `Tervalidasi di ${post.clusterCode} (Satelit FIRMS & Posko)`
        : "Tervalidasi oleh petugas Posko BPBD",
    time: isMenungguVerifikasi ? "Dalam Antrean" : "Terverifikasi",
    done: isDalamPenanganan || isSelesai,
    active: isMenungguVerifikasi,
  };

  const step3 = {
    num: 3,
    title: "Disposisi Relawan",
    desc: latestAssignment?.volunteer?.name
      ? `Ditugaskan ke ${latestAssignment.volunteer.name} (${latestAssignment.volunteer.kabupaten || 'Relawan'})`
      : isMenungguVerifikasi
      ? "Menyiapkan penugasan ke regu tanggap terdekat"
      : "Menugaskan regu tanggap lapangan",
    time: latestAssignment
      ? latestAssignment.status === "ASSIGNED"
        ? "Menunggu Konfirmasi"
        : "Disetujui Posko"
      : isMenungguVerifikasi
      ? "Antrean"
      : "Belum Ditugaskan",
    done:
      isSelesai ||
      (isDalamPenanganan &&
        latestAssignment &&
        ["ACCEPTED", "ON_THE_WAY", "ON_SITE", "COMPLETED"].includes(
          latestAssignment.status
        )),
    active:
      isDalamPenanganan &&
      (!latestAssignment || latestAssignment.status === "ASSIGNED"),
  };

  const step4 = {
    num: 4,
    title: "Operasi Pemadaman Lapangan",
    desc:
      latestAssignment?.status === "ON_SITE"
        ? "Petugas & warga sedang melakukan pemadaman & pendinginan lahan"
        : latestAssignment?.status === "ON_THE_WAY"
        ? "Regu relawan meluncur membawa alat pompa & perlengkapan"
        : isSelesai
        ? "Pemadaman dan pendinginan lahan selesai dilakukan"
        : "Regu relawan bergerak ke titik koordinat kebakaran",
    time: isSelesai
      ? "Selesai"
      : latestAssignment?.status === "ON_SITE"
      ? "Di Lokasi"
      : latestAssignment?.status === "ON_THE_WAY"
      ? "Menuju Lokasi"
      : "Menunggu Regu",
    done: isSelesai,
    active:
      isDalamPenanganan &&
      latestAssignment &&
      ["ACCEPTED", "ON_THE_WAY", "ON_SITE"].includes(latestAssignment.status),
  };

  const step5 = {
    num: 5,
    title: "Pemadaman Selesai & Tuntas",
    desc: isSelesai
      ? "Api padam total, pendinginan gambut & bukti foto terverifikasi oleh Posko"
      : "Target api padam tuntas, pendinginan gambut & upload foto verifikasi",
    time: isSelesai ? "Tuntas" : "Target Padam",
    done: isSelesai,
    active: isSelesai,
  };

  const steps = [step1, step2, step3, step4, step5];

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs p-5 space-y-4">
      {/* Header Transparansi Publik */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-neutral-900 uppercase tracking-wide">
              Lacak Penanganan Transparan
            </h3>
            <p className="text-[11px] text-neutral-500">
              Transparansi akuntabilitas publik tim Posko BPBD & Relawan
            </p>
          </div>
        </div>

        {/* Real-time Status Badge */}
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border flex items-center gap-1.5 ${
            post.status === "SELESAI"
              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
              : post.status === "DALAM_PENANGANAN"
              ? "bg-blue-100 text-blue-800 border-blue-200"
              : "bg-amber-100 text-amber-800 border-amber-200 animate-pulse"
          }`}
        >
          {post.status === "SELESAI" && <CheckCircle2 className="w-3.5 h-3.5" />}
          {post.status === "DALAM_PENANGANAN" && <Truck className="w-3.5 h-3.5 animate-bounce" />}
          {post.status === "MENUNGGU_VERIFIKASI" && <Clock className="w-3.5 h-3.5" />}
          <span>
            {post.status === "SELESAI"
              ? "Tuntas Ditangani"
              : post.status === "DALAM_PENANGANAN"
              ? "Dalam Penanganan"
              : "Menunggu Verifikasi"}
          </span>
        </span>
      </div>

      {/* Metric Cards (Response Time & Assigned Responder) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
        <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-0.5">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            Waktu Respon Posko
          </span>
          <span
            className={`text-sm font-black block truncate ${
              hasResponseTime ? "text-brand-700" : "text-amber-700"
            }`}
          >
            {responseTimeText}
          </span>
          <span className="text-[10px] text-neutral-500 block truncate">
            {hasResponseTime ? "Dari laporan warga masuk" : "Menunggu disposisi relawan"}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-0.5">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            Regu Lapangan
          </span>
          <span className="text-xs font-bold text-neutral-900 block truncate">
            {latestAssignment?.volunteer?.name || "Belum Ditugaskan"}
          </span>
          <span
            className={`text-[10px] font-semibold block truncate ${
              latestAssignment ? "text-emerald-700" : "text-neutral-500"
            }`}
          >
            {latestAssignment
              ? `${latestAssignment.volunteer?.kabupaten || 'Relawan'} • ${volunteerStatusLabel}`
              : "Siaga Wilayah BPBD"}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-0.5 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            Durasi Penanganan
          </span>
          <span
            className={`text-sm font-black block truncate ${
              isSelesai
                ? "text-emerald-700"
                : isDalamPenanganan
                ? "text-blue-700"
                : "text-neutral-700"
            }`}
          >
            {durationText}
          </span>
          <span className="text-[10px] text-neutral-500 block truncate">
            {isSelesai
              ? "Tuntas dipadamkan"
              : isDalamPenanganan
              ? "Operasi lapangan aktif"
              : "Dalam pemantauan"}
          </span>
        </div>
      </div>

      {/* Stepper Progress Timeline */}
      <div className="pt-2">
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={step.num} className="flex items-start gap-3 relative">
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-3.5 top-7 w-0.5 h-7 -translate-x-1/2 ${
                    step.done ? "bg-emerald-500" : "bg-neutral-200"
                  }`}
                />
              )}

              {/* Circle number */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 z-10 shadow-xs ${
                  step.done
                    ? "bg-emerald-600 text-white"
                    : step.active
                    ? "bg-brand-600 text-white ring-4 ring-brand-100 animate-pulse"
                    : "bg-neutral-100 text-neutral-400 border border-neutral-200"
                }`}
              >
                {step.done ? <CheckCircle2 className="w-4 h-4" /> : step.num}
              </div>

              {/* Step info */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-xs font-extrabold ${
                      step.done
                        ? "text-neutral-900"
                        : step.active
                        ? "text-brand-700"
                        : "text-neutral-400"
                    }`}
                  >
                    {step.title}
                  </h4>
                  <span
                    className={`text-[10px] font-semibold shrink-0 px-2 py-0.5 rounded-md ${
                      step.done
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : step.active
                        ? "bg-brand-50 text-brand-800 border border-brand-200"
                        : "text-neutral-400"
                    }`}
                  >
                    {step.time}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Quick Action Bar */}
      {user?.role === "ADMIN" && post.status === "MENUNGGU_VERIFIKASI" && (
        <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-200 text-orange-900 border border-orange-300">
                Aksi Posko BPBD
              </span>
              <h4 className="text-xs font-black text-neutral-900">
                Laporan Menunggu Tindak Lanjut
              </h4>
            </div>
            <p className="text-[11px] text-neutral-600">
              Disposisikan regu relawan terdekat ke titik kejadian ini untuk verifikasi & pemadaman.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenAssign?.(post)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-black transition shadow-sm shadow-brand-500/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Disposisi ke Relawan</span>
          </button>
        </div>
      )}

      {/* Bukti Foto Verifikasi Lapangan jika ada */}
      {latestAssignment?.verificationPhoto && (
        <div className="mt-3 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Bukti Foto Verifikasi Pemadaman Oleh Petugas:</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <button
              type="button"
              aria-label="Lihat foto verifikasi pemadaman"
              onClick={() => onMediaClick?.(latestAssignment.verificationPhoto)}
              className="shrink-0 rounded-lg cursor-pointer"
            >
              <img
                src={latestAssignment.verificationPhoto}
                alt="Verifikasi pemadaman"
                className="w-24 h-24 rounded-lg object-cover border border-emerald-200 shadow-2xs cursor-pointer"
              />
            </button>
            <div className="text-xs text-neutral-700 space-y-1">
              <p>
                <strong>Pelapor Verifikasi:</strong>{" "}
                {latestAssignment.volunteer?.name || "Relawan BPBD Sintang"}
              </p>
              {latestAssignment.verificationGpsLat != null &&
                latestAssignment.verificationGpsLon != null && (
                  <p>
                    <strong>Koordinat GPS Lapangan:</strong>{" "}
                    {latestAssignment.verificationGpsLat},{" "}
                    {latestAssignment.verificationGpsLon}
                  </p>
                )}
              {latestAssignment.notes && (
                <p className="text-neutral-600 italic">
                  "{latestAssignment.notes}"
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
