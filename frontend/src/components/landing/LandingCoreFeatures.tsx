import * as React from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'motion/react';
import {
  Flame,
  Wind,
  Thermometer,
  MapPin,
  Compass,
  Camera,
  Clock,
  Sparkles,
  Database,
  CheckCircle2,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { StaggerTextContainer, SplitText, BlurReveal } from '@/components/ui/motion';

// ========================================================
// BLOK 1: MESIN PEMERINGKAT BAHAYA TITIK API (THREAT ENGINE)
// ========================================================

interface FactorCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  delay: number;
  phase: number;
  index: number;
}

const ThreatFactorCard = ({ icon: Icon, title, value, delay, phase, index }: FactorCardProps) => {
  const isProcessing = phase === 2;
  const isDone = phase >= 3;
  const isVisible = phase >= 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{
        opacity: isVisible ? (isDone ? 0.7 : 1) : 0,
        x: isVisible ? 0 : -20,
        scale: isProcessing ? [1, 1.02, 1] : 1,
        borderColor: isProcessing ? '#ea580c' : '#e5e5e5',
      }}
      transition={{
        duration: 0.5,
        delay: isVisible && !isProcessing ? delay : 0,
        scale: { duration: 0.8, delay: index * 0.12, repeat: isProcessing ? Infinity : 0 },
      }}
      whileHover={{ y: -2, scale: 1.02, borderColor: '#ea580c' }}
      className="bg-white border border-neutral-200 rounded-2xl p-3 flex items-center justify-between gap-3 relative z-10 cursor-default transition-all shadow-xs"
    >
      <div className="flex items-center gap-3">
        <div className="bg-orange-50 border border-orange-200/80 w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-orange-600" />
        </div>
        <div>
          <div className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">{title}</div>
          <div className="text-xs sm:text-sm font-semibold text-neutral-900">{value}</div>
        </div>
      </div>
      <div className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
    </motion.div>
  );
};

const AnimatedGaugeAndScore = ({ phase }: { phase: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const pathLength = useTransform(count, [0, 100], [0, 1]);

  React.useEffect(() => {
    if (phase === 0) count.set(0);
    if (phase === 3) {
      animate(count, 68, { duration: 0.5, ease: 'easeOut' });
      const t1 = setTimeout(() => animate(count, 86, { duration: 0.6, ease: 'easeOut' }), 1000);
      const t2 = setTimeout(() => animate(count, 94, { duration: 0.7, ease: 'easeOut' }), 2000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [phase, count]);

  return (
    <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
      {/* Background Track Circle */}
      <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-xs" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" stroke="#f1f5f9" strokeWidth="6" fill="none" />
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          stroke="url(#fireGradient)"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          style={{ pathLength }}
        />
        <defs>
          <linearGradient id="fireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="60%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex flex-col items-center z-10">
        <div className="flex items-baseline">
          <motion.span className="text-4xl sm:text-5xl font-heading font-black text-neutral-900 tabular-nums leading-none tracking-tight">
            {rounded}
          </motion.span>
          <span className="text-xl font-bold text-orange-600 ml-0.5">%</span>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 mt-2">
          Indeks Bahaya Api
        </span>
      </div>
    </div>
  );
};

const FireRiskEngineBlock = () => {
  const [phase, setPhase] = React.useState(0);

  const factors = [
    { icon: Flame, title: 'Radiasi Termal (FRP)', value: '342.8 MW (VIIRS)' },
    { icon: Thermometer, title: 'Kadar Air Gambut', value: 'Kering Kritis (<24%)' },
    { icon: Wind, title: 'Kecepatan Angin', value: '22 km/jam Arah Barat' },
    { icon: MapPin, title: 'Jarak Pemukiman', value: '1.8 km dari Desa' },
    { icon: Activity, title: 'Klaster Spasial', value: '14 Hotspot (DBSCAN)' },
  ];

  React.useEffect(() => {
    let isMounted = true;
    const runSequence = async () => {
      while (isMounted) {
        setPhase(0);
        await new Promise((r) => setTimeout(r, 600));
        setPhase(1);
        await new Promise((r) => setTimeout(r, 1400));
        setPhase(2);
        await new Promise((r) => setTimeout(r, 1800));
        setPhase(3);
        await new Promise((r) => setTimeout(r, 3400));
        setPhase(4);
        await new Promise((r) => setTimeout(r, 3600));
      }
    };
    runSequence();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      {/* Left Column: Descriptive Typography */}
      <div className="flex flex-col gap-5 order-2 lg:order-1 max-w-xl text-left">
        <BlurReveal delay={0.05}>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
            Kalkulator Risiko Terpadu
          </span>
        </BlurReveal>

        <StaggerTextContainer
          delayChildren={0.1}
          staggerChildren={0.04}
          className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-neutral-900 leading-[1.1] tracking-tight mt-1"
        >
          <span>
            <SplitText text="Sistem Penilaian Bahaya" />
          </span>{' '}
          <br />
          <span className="text-orange-600">
            <SplitText text="Anti-Spekulasi." />
          </span>
        </StaggerTextContainer>

        <BlurReveal delay={0.25}>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-light">
            Tingkat kegawatan kebakaran dihitung otomatis dari 5 parameter multi-sensor satelit dan kondisi
            lahan gambut Kalimantan. Menghilangkan keraguan komandan lapangan dalam menetapkan status tanggap
            darurat.
          </p>
        </BlurReveal>
      </div>

      {/* Right Column: Code-Driven Interactive Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="order-1 lg:order-2 w-full flex justify-center lg:justify-end"
      >
        <div className="bg-neutral-50/80 border border-neutral-200/90 rounded-3xl p-5 sm:p-8 w-full max-w-[540px] shadow-sm relative flex items-center justify-center min-h-[440px]">
          {/* Visual Connection Laser Lines */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-3xl">
            <AnimatePresence>
              {phase === 2 && (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: '20%' }}
                    animate={{ opacity: [0, 0.8, 0], x: ['20%', '65%'] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
                    className="absolute top-[28%] w-28 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent"
                  />
                  <motion.div
                    initial={{ opacity: 0, x: '20%' }}
                    animate={{ opacity: [0, 0.8, 0], x: ['20%', '65%'] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
                    className="absolute top-[50%] w-28 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"
                  />
                  <motion.div
                    initial={{ opacity: 0, x: '20%' }}
                    animate={{ opacity: [0, 0.8, 0], x: ['20%', '65%'] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: 0.8 }}
                    className="absolute top-[72%] w-28 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"
                  />
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row w-full gap-5 sm:gap-6 relative z-10 items-center">
            {/* 5 Input Factors */}
            <div className="flex flex-col justify-center gap-2 w-full sm:flex-1">
              {factors.map((f, i) => (
                <ThreatFactorCard
                  key={f.title}
                  icon={f.icon}
                  title={f.title}
                  value={f.value}
                  delay={0.1 * i}
                  phase={phase}
                  index={i}
                />
              ))}
            </div>

            {/* Target Display: Gauge + Badge */}
            <div className="w-full sm:flex-1 flex flex-col items-center justify-center mt-2 sm:mt-0">
              <motion.div
                className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-neutral-200/90 w-full max-w-[220px] sm:max-w-none aspect-square flex flex-col items-center justify-center relative transition-all"
                animate={{
                  scale: phase >= 2 ? 1.04 : 1,
                  borderColor: phase >= 2 ? '#ea580c' : '#e5e5e5',
                  boxShadow:
                    phase >= 3
                      ? '0 15px 35px -10px rgba(234, 88, 12, 0.2)'
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                }}
                transition={{ duration: 0.6 }}
              >
                <AnimatedGaugeAndScore phase={phase} />

                {/* Priority Badge Pop */}
                <AnimatePresence>
                  {phase >= 4 && (
                    <motion.div
                      initial={{ scale: 0, y: 15, opacity: 0 }}
                      animate={{ scale: 1, y: 0, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                      className="absolute -bottom-3.5 bg-red-600 text-white text-[10px] sm:text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md shadow-red-600/30 whitespace-nowrap"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-200" />
                      <span>Prioritas P1: Intervensi Darurat</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ========================================================
// BLOK 2: VERIFIKASI BUKTI WARGA & DISPOSISI PEMADAM
// ========================================================

interface ReportInputProps {
  icon: React.ElementType;
  label: string;
  value: string;
  delay: number;
  phase: number;
  index: number;
}

const ReportInputCard = ({ icon: Icon, label, value, delay, phase, index }: ReportInputProps) => {
  const isVisible = phase >= 1;
  const isProcessing = phase === 2;
  const isDone = phase >= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{
        opacity: isVisible ? (isDone ? 0.7 : 1) : 0,
        y: isVisible ? 0 : 15,
        scale: isProcessing ? [1, 1.02, 1] : 1,
        borderColor: isProcessing ? '#059669' : '#e5e5e5',
      }}
      transition={{
        duration: 0.5,
        delay: isVisible && !isProcessing ? delay : 0,
        scale: { duration: 0.8, delay: index * 0.15, repeat: isProcessing ? Infinity : 0 },
      }}
      whileHover={{ y: -2, scale: 1.02, borderColor: '#059669' }}
      className="bg-white border border-neutral-200 rounded-2xl p-3 flex items-center gap-3 relative z-10 cursor-default transition-all shadow-xs w-full"
    >
      <div className="bg-emerald-50 border border-emerald-200/80 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
        <Icon className="w-4.5 h-4.5 text-emerald-600" />
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">{label}</span>
        <span className="text-xs sm:text-sm font-semibold text-neutral-900 truncate mt-0.5">{value}</span>
      </div>
    </motion.div>
  );
};

const AnimatedDispatchResult = ({ phase }: { phase: number }) => {
  const countMin = useMotionValue(0);
  const countMax = useMotionValue(0);

  const formattedMin = useTransform(countMin, (val) => `${Math.round(val)}`);
  const formattedMax = useTransform(countMax, (val) => `${Math.round(val)} Mnt`);

  React.useEffect(() => {
    if (phase === 0) {
      countMin.set(0);
      countMax.set(0);
    }
    if (phase === 3) {
      animate(countMin, 18, { duration: 0.9, ease: 'easeOut' });
      const t = setTimeout(() => animate(countMax, 24, { duration: 0.9, ease: 'easeOut' }), 600);
      return () => clearTimeout(t);
    }
  }, [phase, countMin, countMax]);

  return (
    <div className="flex items-center justify-center gap-2">
      <motion.span className="text-3xl sm:text-4xl font-heading font-black text-neutral-900 tabular-nums leading-none">
        {formattedMin}
      </motion.span>
      <span className="text-emerald-600 font-bold text-2xl leading-none">–</span>
      <motion.span className="text-3xl sm:text-4xl font-heading font-black text-neutral-900 tabular-nums leading-none">
        {formattedMax}
      </motion.span>
    </div>
  );
};

const VerticalScanLaser = () => (
  <motion.div
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: 36, opacity: 1 }}
    exit={{ height: 0, opacity: 0 }}
    className="w-px bg-gradient-to-b from-transparent via-emerald-500 to-transparent relative mx-auto my-1"
  >
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_2px_rgba(16,185,129,0.5)]"
      animate={{ y: [0, 36, 0] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
    />
  </motion.div>
);

const ZeroHoaxDispatchBlock = () => {
  const [phase, setPhase] = React.useState(0);

  const inputs = [
    { icon: Camera, label: 'Metode Tangkapan', value: 'Kamera HP Langsung (Live)' },
    { icon: Compass, label: 'Kunci Koordinat', value: 'GPS Satelit Akurasi 3.8m' },
    { icon: Clock, label: 'Integritas Waktu', value: 'Cap Waktu Sinkron Server BPBD' },
  ];

  React.useEffect(() => {
    let isMounted = true;
    const runSequence = async () => {
      while (isMounted) {
        setPhase(0);
        await new Promise((r) => setTimeout(r, 600));
        setPhase(1);
        await new Promise((r) => setTimeout(r, 1400));
        setPhase(2);
        await new Promise((r) => setTimeout(r, 1800));
        setPhase(3);
        await new Promise((r) => setTimeout(r, 3400));
        setPhase(4);
        await new Promise((r) => setTimeout(r, 3600));
      }
    };
    runSequence();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      {/* Left Column: Interactive Simulation Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="order-2 lg:order-1 w-full flex justify-center lg:justify-start"
      >
        <div className="bg-neutral-50/80 border border-neutral-200/90 rounded-3xl p-6 sm:p-10 w-full max-w-[540px] shadow-sm relative flex flex-col items-center justify-center min-h-[440px]">
          <div className="flex flex-col w-full max-w-[360px] relative z-10">
            {/* 3 Real-time Input Cards */}
            <div className="flex flex-col gap-2.5">
              {inputs.map((inp, i) => (
                <ReportInputCard
                  key={inp.label}
                  icon={inp.icon}
                  label={inp.label}
                  value={inp.value}
                  delay={0.1 * i}
                  phase={phase}
                  index={i}
                />
              ))}
            </div>

            {/* Central Scanning Connector */}
            <div className="flex justify-center h-10 w-full items-center">
              <AnimatePresence>
                {phase === 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center w-full relative"
                  >
                    <VerticalScanLaser />
                    <div className="absolute left-1/2 ml-4 flex items-center gap-1.5 text-emerald-600">
                      <Database className="w-3.5 h-3.5 animate-pulse" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">
                        Memindai Metadata Foto...
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Result Box: ETA and Target Station */}
            <motion.div
              className="bg-white border border-neutral-200/90 rounded-2xl p-5 flex flex-col items-center justify-center shadow-md relative overflow-hidden transition-all"
              animate={{
                scale: phase >= 3 ? 1.04 : 1,
                borderColor: phase >= 3 ? '#059669' : '#e5e5e5',
                boxShadow:
                  phase >= 4
                    ? '0 15px 35px -10px rgba(16, 185, 129, 0.2)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-600" /> Estimasi Tiba Regu Pemadam (ETA)
              </span>

              <AnimatedDispatchResult phase={phase} />

              <span className="text-xs font-medium text-neutral-500 mt-2 text-center">
                Posko Manggala Agni Sintang (4.2 km dari titik api)
              </span>

              {/* Status Verified Stamp */}
              <AnimatePresence>
                {phase >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute top-2.5 right-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Laporan Terverifikasi</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Right Column: Descriptive Typography */}
      <div className="flex flex-col gap-5 order-1 lg:order-2 max-w-xl lg:pl-6 text-left">
        <BlurReveal delay={0.05}>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Integritas Laporan Warga
          </span>
        </BlurReveal>

        <StaggerTextContainer
          delayChildren={0.1}
          staggerChildren={0.04}
          className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-neutral-900 leading-[1.1] tracking-tight mt-1"
        >
          <span>
            <SplitText text="Verifikasi Anti-Hoax &" />
          </span>{' '}
          <br />
          <span className="text-emerald-600">
            <SplitText text="Disposisi Cepat." />
          </span>
        </StaggerTextContainer>

        <BlurReveal delay={0.25}>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-light">
            Setiap laporan warga wajib diambil secara langsung dari kamera perangkat tanpa akses galeri foto arsip.
            Sistem langsung mengunci koordinat GPS satelit dan menghitung jarak tercepat ke posko regu pemadam
            terdekat.
          </p>
        </BlurReveal>
      </div>
    </div>
  );
};

// ========================================================
// KOMPONEN UTAMA SECTION
// ========================================================

export function LandingCoreFeatures() {
  return (
    <section className="bg-white py-24 sm:py-32 lg:py-40 relative overflow-hidden text-neutral-900 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 lg:mb-28 flex flex-col items-center">
          <BlurReveal delay={0.05}>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-3">
              Mesin Penggerak & Validasi Karhutla
            </p>
          </BlurReveal>

          <StaggerTextContainer
            delayChildren={0.1}
            staggerChildren={0.04}
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-neutral-900 leading-[1.15] tracking-tight"
          >
            <span>
              <SplitText text="Dirancang untuk Mendeteksi Bahaya" />
            </span>{' '}
            <br className="hidden sm:block" />
            <span className="text-neutral-500 font-normal">
              <SplitText text="dan Memvalidasi Kebenaran Lapangan." />
            </span>
          </StaggerTextContainer>
        </div>

        {/* Feature 1: Fire Threat Risk Engine */}
        <FireRiskEngineBlock />

        {/* Separator Line */}
        <div className="h-24 sm:h-32 w-full flex items-center justify-center">
          <div className="w-px h-full bg-gradient-to-b from-transparent via-neutral-200 to-transparent" />
        </div>

        {/* Feature 2: Zero-Hoax Verification & Rapid Dispatch */}
        <ZeroHoaxDispatchBlock />
      </div>
    </section>
  );
}
