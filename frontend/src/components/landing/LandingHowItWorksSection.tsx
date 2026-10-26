import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Satellite,
  Camera,
  Send,
  Clock,
  ShieldCheck,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { StaggerTextContainer, SplitText, BlurReveal } from '@/components/ui/motion';

// Preview 0: Satellite Detection & Spatial Clustering Mockup
function SatellitePreview() {
  return (
    <div className="absolute inset-0 w-full h-full flex flex-col justify-end px-6 sm:px-12 pt-10 overflow-hidden bg-neutral-900 text-white">
      <div className="w-full max-w-3xl mx-auto bg-neutral-950 rounded-t-3xl border border-neutral-800 border-b-0 p-6 sm:p-8 flex flex-col h-[340px] sm:h-[400px] shadow-2xl">
        {/* Header telemetry */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 text-xs">
          <div className="flex items-center gap-2">
            <Satellite className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-neutral-200">Orbit LEO VIIRS • NASA FIRMS Downlink</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800/60">
            Sensor Sinkron
          </span>
        </div>

        {/* Spatial Clustering Grid Visual */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 flex-1">
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
            <div className="text-[11px] text-neutral-400">Radiasi Termal (FRP)</div>
            <div className="text-2xl font-black text-orange-400">324.8 K</div>
            <div className="text-[10px] text-neutral-500">Ambang batas api kritis</div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
            <div className="text-[11px] text-neutral-400">Algoritma DBSCAN</div>
            <div className="text-2xl font-black text-white">12 Klaster</div>
            <div className="text-[10px] text-neutral-500">Dikelompokkan otomatis</div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
            <div className="text-[11px] text-neutral-400">Tingkat Keyakinan</div>
            <div className="text-2xl font-black text-emerald-400">95% Nominal</div>
            <div className="text-[10px] text-neutral-500">Sensor multi-spektral</div>
          </div>
        </div>

        {/* Simulated Spatial Cluster Tag */}
        <div className="mt-auto p-3.5 rounded-xl bg-orange-950/50 border border-orange-900/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-orange-300">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="font-semibold">Klaster Prioritas P1: Kecamatan Sintang, Kalimantan Barat</span>
          </div>
          <span className="text-[10px] text-orange-400 font-bold">18 Hotspots</span>
        </div>
      </div>
    </div>
  );
}

// Preview 1: Citizen Live GPS Camera Mockup
function CitizenCameraPreview() {
  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center p-6 bg-neutral-100">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white rounded-3xl border border-neutral-300 shadow-xl overflow-hidden text-left"
      >
        {/* Camera Viewfinder View */}
        <div className="relative aspect-video bg-neutral-900 flex items-center justify-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80"
            alt="Dokumentasi Kamera Lapangan"
            className="w-full h-full object-cover opacity-80"
          />

          {/* Target Reticle Overlay */}
          <div className="absolute inset-8 border border-white/40 rounded-2xl pointer-events-none flex items-center justify-center">
            <div className="w-4 h-4 border-t-2 border-l-2 border-orange-500 absolute top-2 left-2" />
            <div className="w-4 h-4 border-t-2 border-r-2 border-orange-500 absolute top-2 right-2" />
            <div className="w-4 h-4 border-b-2 border-l-2 border-orange-500 absolute bottom-2 left-2" />
            <div className="w-4 h-4 border-b-2 border-r-2 border-orange-500 absolute bottom-2 right-2" />
          </div>

          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 text-[10px] font-bold text-white">
            <Camera className="w-3 h-3 text-orange-400" />
            <span>Kamera Live (Anti-Hoax)</span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] text-white/90 bg-black/60 px-3 py-1.5 rounded-lg">
            <span>GPS: 0.0389° S, 110.3421° E</span>
            <span>Akurasi: ±3 Meter</span>
          </div>
        </div>

        {/* Verification Metadata Details */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900">Validasi Otentikasi Laporan</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Terverifikasi
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-neutral-600">
            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 border border-neutral-100">
              <span className="flex items-center gap-1.5 text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Akses Galeri HP
              </span>
              <span className="font-bold text-neutral-900">Dinonaktifkan (Live Only)</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 border border-neutral-100">
              <span className="flex items-center gap-1.5 text-neutral-500">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Cap Waktu Nyata
              </span>
              <span className="font-bold text-neutral-900">Tersinkronisasi Server</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Preview 2: WhatsApp Dispatch to Emergency Team Mockup
function DispatchPreview() {
  return (
    <div className="absolute inset-0 w-full h-full flex flex-col justify-end px-6 sm:px-12 pt-10 overflow-hidden bg-neutral-100">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-t-3xl border border-neutral-300 border-b-0 p-6 sm:p-8 flex flex-col h-[340px] sm:h-[400px] shadow-xl text-left">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Lembar Tugas Darurat
            </div>
            <div className="text-base font-bold text-neutral-900">
              Disposisi Regu Manggala Agni / BPBD
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            Status: PRIORITAS P1
          </span>
        </div>

        <div className="py-6 space-y-3 flex-1">
          {/* Simulated WhatsApp Notification Box */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <Send className="w-4 h-4 text-emerald-600" />
              <span>Instruksi WhatsApp Terkirim Otomatis</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed font-mono">
              [FIREZONE POSKO] Peringatan P1! Titik api terdeteksi di Desa Teluk Melano. Koordinat:
              -0.0389, 110.3421. Rute navigasi: https://firezone.id/r/s7a9. Mohon konfirmasi unit.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <span className="text-neutral-500 block text-[11px]">Personel Bertugas</span>
              <span className="font-bold text-neutral-900">Regu 3 BPBD Sintang</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <span className="text-neutral-500 block text-[11px]">Estimasi Tiba</span>
              <span className="font-bold text-neutral-900">&lt; 25 Menit (Siaga)</span>
            </div>
          </div>
        </div>

        <div className="mt-auto p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            WhatsApp Delivery Confirmed
          </span>
          <span className="font-semibold text-neutral-900">2 Personel Terkonfirmasi</span>
        </div>
      </div>
    </div>
  );
}

export function LandingHowItWorksSection() {
  const steps = [
    {
      title: 'Deteksi Satelit LEO',
      subtitle: 'Sinkronisasi Otomatis Tiap 3 Jam',
      desc: 'Sensor VIIRS NASA menangkap anomali radiasi suhu tinggi dari antariksa. Algoritma DBSCAN langsung memetakan perimeter klaster tanpa menunggu laporan manual.',
    },
    {
      title: 'Kamera Warga Anti-Hoax',
      subtitle: 'Validasi Visual Bukti Lapangan',
      desc: 'Warga memotret langsung melalui kamera web app tanpa akses galeri foto. Koordinat GPS latitude/longitude dan cap waktu terkunci otomatis di metadata server.',
    },
    {
      title: 'Disposisi WhatsApp Cepat',
      subtitle: 'Aksi Tanggap Darurat Posko BPBD',
      desc: 'Admin posko langsung menugaskan relawan dan regu pemadam terdekat. Tautan navigasi dan detail bahaya terkirim instan ke nomor WhatsApp tim pemadam.',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const DURATION = 6000;

  useEffect(() => {
    let animationFrameId: number;
    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;

      const currentProgress = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(currentProgress);

      if (elapsed < DURATION) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setActiveIndex((prev) => (prev + 1) % steps.length);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeIndex, steps.length]);

  const handleTabClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
      setProgress(0);
    }
  };

  const previews = [
    <SatellitePreview key="0" />,
    <CitizenCameraPreview key="1" />,
    <DispatchPreview key="2" />,
  ];

  return (
    <section id="cara-kerja" className="bg-white py-20 sm:py-28 lg:py-36 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-3">
          <BlurReveal delay={0.05}>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-600">
              Alur Terkoordinasi 3 Langkah
            </p>
          </BlurReveal>

          <StaggerTextContainer
            delayChildren={0.1}
            staggerChildren={0.04}
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight leading-[1.12]"
          >
            <SplitText text="Bagaimana Informasi Satelit Menggerakkan Regu di Darat." />
          </StaggerTextContainer>

          <BlurReveal delay={0.25}>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal max-w-2xl">
              Satu alur terintegrasi menghubungkan satelit luar angkasa, warga di lapangan, dan petugas
              posko darurat tanpa jeda birokrasi.
            </p>
          </BlurReveal>
        </div>

        {/* Ordina-Style Borderless Tabs with Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 mb-10">
          {steps.map((step, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={step.title}
                type="button"
                onClick={() => handleTabClick(i)}
                className="relative text-left flex flex-col pt-6 focus:outline-none group w-full cursor-pointer"
              >
                {/* Background Track */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-neutral-200 group-hover:bg-neutral-300 transition-colors" />

                {/* Active Progress Bar */}
                <div
                  className="absolute top-0 left-0 h-[2px] bg-orange-600"
                  style={{
                    width: isActive ? `${progress}%` : '0%',
                    transition: isActive ? 'none' : 'width 0.3s ease-out',
                  }}
                />

                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 mb-1">
                  Langkah 0{i + 1}
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5 font-medium">{step.subtitle}</p>
                <p className="text-xs text-neutral-600 leading-relaxed mt-3">{step.desc}</p>
              </button>
            );
          })}
        </div>

        {/* High-End Interactive Mockup Container */}
        <div className="relative w-full h-[400px] sm:h-[480px] rounded-3xl border border-neutral-300 bg-neutral-100 overflow-hidden shadow-lg mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {previews[activeIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
