import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { motion, useMotionValue, animate } from 'motion/react';
import {
  Map as MapIcon,
  Camera,
  Flame,
  Maximize2,
  Layers,
  ArrowRight,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
} from 'lucide-react';
import { HotspotMap } from '@/features/hotspots/components/HotspotMap';
import type { PriorityArea } from '@/features/hotspots/schemas';
import { StaggerTextContainer, SplitText, BlurReveal } from '@/components/ui/motion';

interface LandingHeroProps {
  areas: PriorityArea[];
  totalHotspots?: number | null;
  highestRiskArea?: string;
}

export function LandingHero({ areas, totalHotspots = 18, highestRiskArea }: LandingHeroProps) {
  const [selectedArea, setSelectedArea] = useState<PriorityArea | null>(null);

  // Animated Hotspot Counter with Framer ease curve [0.16, 1, 0.3, 1]
  const count = useMotionValue(0);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    const target = totalHotspots != null ? totalHotspots : 18;
    const controls = animate(count, target, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplayCount(Math.floor(latest)),
    });
    return controls.stop;
  }, [totalHotspots, count]);

  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 bg-white border-b border-neutral-200 overflow-hidden">
      {/* Background Subtle Spatial Grid & Soft Ember Glow */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.025)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_25%,#000_65%,transparent_100%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[420px] bg-gradient-to-b from-orange-500/5 via-amber-500/3 to-transparent blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top: Centered Monumental Stage */}
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">

          {/* Main Headline with Staggered Word Reveal */}
          <StaggerTextContainer
            delayChildren={0.12}
            staggerChildren={0.035}
            className="font-heading text-4xl sm:text-6xl lg:text-[66px] font-bold tracking-tight text-neutral-900 leading-[1.08]"
          >
            <SplitText text="Pantau dan Kendalikan Titik Api Rimba Kalimantan." />
          </StaggerTextContainer>

          {/* Punchy Subline */}
          <BlurReveal delay={0.25}>
            <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Sensor satelit mendeteksi anomali suhu gambut setiap 3 jam. Warga memverifikasi dari
              lapangan dengan foto GPS terkunci untuk mengarahkan armada pemadam BPBD tepat sasaran.
            </p>
          </BlurReveal>

          {/* Action CTAs */}
          <BlurReveal delay={0.35}>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
              <Link
                to="/map"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-xs hover:shadow-sm active:scale-98 transition duration-150 group"
              >
                <MapIcon className="w-4 h-4" />
                <span>Buka Radar Sebaran Api</span>
                <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to="/community/create"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-neutral-800 bg-white hover:bg-neutral-50 border border-neutral-300 shadow-2xs active:scale-98 transition duration-150"
              >
                <Camera className="w-4 h-4 text-orange-600" />
                <span>Lapor Temuan Kamera HP</span>
              </Link>
            </div>
          </BlurReveal>
        </div>

        {/* Bottom: Grand Floating Spatial Command Deck */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 sm:mt-16 max-w-6xl mx-auto relative"
        >
          {/* Main Command Window Frame */}
          <div className="rounded-2xl sm:rounded-3xl border border-neutral-300/90 bg-white shadow-[0_25px_70px_-15px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_35px_90px_-20px_rgba(0,0,0,0.12)]">
            {/* Window Chrome Header Bar */}
            <div className="px-4 sm:px-6 py-3 border-b border-neutral-200 bg-neutral-100/90 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
                </div>
                <span className="text-xs font-bold text-neutral-800 ml-2 hidden sm:inline">
                  Posko Spasial Karhutla Kalimantan
                </span>
                <span className="text-xs font-bold text-neutral-800 ml-2 sm:hidden">
                  Posko Spasial
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/70 text-[11px] font-semibold text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>DBSCAN Clustering Aktif</span>
                </div>

                <Link
                  to="/map"
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition"
                  title="Buka Peta Lengkap"
                >
                  <span className="hidden sm:inline">Layar Penuh</span>
                  <Maximize2 className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Main Interactive Stage with Floating Telemetry HUDs */}
            <div className="h-[380px] sm:h-[480px] lg:h-[520px] w-full relative">
              <HotspotMap
                areas={areas}
                selectedArea={selectedArea}
                onSelectArea={setSelectedArea}
                className="w-full h-full"
                hideControlsOnMobile
              />

              {/* Floating HUD 1 (Top Left): Telemetri Cuaca & Gambut */}
              <div className="absolute top-3 left-3 z-[1000] hidden sm:flex flex-col gap-1.5 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-md text-left text-neutral-800 max-w-[210px]">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-100 pb-1">
                  <span>Telemetri Gambut</span>
                  <span className="text-emerald-600 font-bold">Live</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-0.5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <div>
                      <p className="text-[10px] text-neutral-600 leading-none">Arah Angin</p>
                      <p className="font-bold text-neutral-800 text-[11px]">14 km/j TG</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <div>
                      <p className="text-[10px] text-neutral-600 leading-none">Kelembaban</p>
                      <p className="font-bold text-neutral-800 text-[11px]">42% RH</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pt-1 border-t border-neutral-100">
                  <Thermometer className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span className="text-[11px] text-neutral-700">
                    Suhu Permukaan: <strong className="font-bold text-neutral-900">33.4°C</strong>
                  </span>
                </div>
              </div>

              {/* Floating HUD 2 (Top Right): Real-time Hotspot Counter */}
              <div className="absolute top-3 right-3 z-[1000] p-3 sm:p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-md text-left max-w-[220px]">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>Titik Terdeteksi</span>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                    VIIRS 375m
                  </span>
                </div>

                <div className="flex items-baseline gap-2 pt-1.5">
                  <span className="font-heading text-3xl font-extrabold text-neutral-900 tabular-nums">
                    {displayCount}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">
                    Titik Panas Aktif
                  </span>
                </div>

                <p className="text-[11px] text-neutral-600 leading-snug pt-1.5 mt-1 border-t border-neutral-100">
                  Kluster tertinggi:{' '}
                  <strong className="text-neutral-900 font-bold">
                    {highestRiskArea || 'Kecamatan Sintang'}
                  </strong>
                </p>
              </div>

              {/* Floating HUD 3 (Bottom Left): Active Layer Legend */}
              <div className="absolute bottom-3 left-3 z-[1000] hidden md:flex items-center gap-2 p-2 rounded-xl bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-md text-[11px] text-neutral-700">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 font-semibold text-neutral-800">
                  <Layers className="w-3 h-3 text-neutral-500" />
                  <span>Satelit VIIRS</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-medium">
                  <ShieldAlert className="w-3 h-3 text-orange-600" />
                  <span>Radius Pemukiman</span>
                </div>
              </div>

              {/* Selected Area HUD Overlay */}
              {selectedArea && (
                <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:max-w-md z-[1000] p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-lg flex items-center justify-between text-left">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-orange-100 text-orange-800">
                        Prioritas {selectedArea.priority}
                      </span>
                      <span className="text-xs font-bold text-neutral-900">
                        {selectedArea.name} ({selectedArea.district})
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600 mt-0.5">
                      {selectedArea.hotspotCount} titik panas • Skor Risiko {selectedArea.score}
                    </p>
                  </div>

                  <Link
                    to="/map"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-neutral-900 text-white hover:bg-neutral-800 transition ml-3 shrink-0"
                  >
                    Buka Rincian
                  </Link>
                </div>
              )}
            </div>

            {/* Window Chrome Footer Bar with Sensor Metadata */}
            <div className="px-4 sm:px-6 py-2.5 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] text-neutral-500 font-medium">
              <span>Sensor: NASA VIIRS NOAA-20 & SNPP • Resolusi Spasial 375m</span>
              <span>Proyeksi: WGS84 EPSG:4326 • Kalimantan Barat & Tengah</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

