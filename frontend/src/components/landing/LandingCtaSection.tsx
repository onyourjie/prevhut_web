import * as React from 'react';
import { Link } from '@tanstack/react-router';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Satellite, Camera, Send, ShieldCheck, Map } from 'lucide-react';
import { StaggerTextContainer, SplitText, BlurReveal } from '@/components/ui/motion';

export function LandingCtaSection() {
  const cards = [
    {
      icon: <Satellite className="w-5 h-5 text-orange-600" />,
      text: 'Sensor Satelit LEO NASA 24/7',
      sub: 'Downlink orbit tiap 3 jam',
    },
    {
      icon: <Camera className="w-5 h-5 text-blue-600" />,
      text: 'Laporan Kamera Terkunci GPS',
      sub: 'Otentik tanpa akses galeri',
    },
    {
      icon: <Send className="w-5 h-5 text-emerald-600" />,
      text: 'Disposisi Instan ke WhatsApp',
      sub: 'Rute titik api ke personel lapangan',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-neutral-800" />,
      text: 'Keterbukaan Data untuk Publik',
      sub: 'Transparansi penanganan bencana',
    },
  ];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const springConfig = { stiffness: 50, damping: 20, mass: 1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  return (
    <section className="bg-neutral-50/60 py-20 sm:py-28 lg:py-36 border-b border-neutral-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative bg-white border border-neutral-300 rounded-[32px] sm:rounded-[44px] shadow-sm overflow-hidden p-8 sm:p-12 lg:p-18"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
            {/* Left Column: Heading & Actions */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <BlurReveal delay={0.05}>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-600">
                  Aksi Kolektif Penyelamatan Hutan
                </p>
              </BlurReveal>

              <StaggerTextContainer
                delayChildren={0.1}
                staggerChildren={0.04}
                className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 tracking-tight leading-[1.08]"
              >
                <span>
                  <SplitText text="Jaga Rimba Kalimantan," />
                </span>{' '}
                <br />
                <span className="text-orange-600">
                  <SplitText text="Cegah Bencana Bersama." />
                </span>
              </StaggerTextContainer>

              <BlurReveal delay={0.25}>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal max-w-xl">
                  Baik Anda warga yang tinggal di dekat perbatasan hutan, relawan lapangan, maupun masyarakat
                  yang ingin memantau persebaran kabut asap, peran Anda langsung menyelamatkan ekosistem dan kehidupan.
                </p>
              </BlurReveal>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  to="/map"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-sm active:scale-95 transition"
                >
                  <Map className="w-4 h-4" />
                  <span>Buka Peta Titik Panas</span>
                </Link>

                <Link
                  to="/community/create"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-xs sm:text-sm font-bold text-neutral-800 bg-white hover:bg-neutral-50 border border-neutral-300 shadow-2xs active:scale-95 transition"
                >
                  <Camera className="w-4 h-4 text-orange-600" />
                  <span>Kirim Laporan Kamera HP</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Mouse Parallax Staircase Cards */}
            <div className="lg:col-span-5 flex flex-col justify-center items-center lg:items-end w-full">
              <div className="w-full max-w-sm flex flex-col gap-3">
                {cards.map((card, idx) => {
                  const depthMultiplier = 1 + idx * 0.25;
                  return (
                    <motion.div
                      key={card.text}
                      style={{
                        x: useTransform(springX, (v) => v * depthMultiplier),
                        y: useTransform(springY, (v) => v * depthMultiplier),
                      }}
                      className="transition-transform duration-150"
                    >
                      <div
                        className="flex items-center gap-3.5 p-4 bg-white/95 backdrop-blur-md border border-neutral-200 hover:border-neutral-300 shadow-sm hover:shadow-md rounded-2xl transition duration-200 text-left cursor-default"
                        style={{ marginLeft: `${idx * 16}px` }}
                      >
                        <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0">
                          {card.icon}
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
                            {card.text}
                          </div>
                          <div className="text-[11px] text-neutral-500 font-medium mt-0.5">
                            {card.sub}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
