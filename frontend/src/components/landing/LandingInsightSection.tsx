import { motion } from 'motion/react';
import { Satellite, Flame, ShieldCheck } from 'lucide-react';
import { StaggerTextContainer, SplitText, BlurReveal } from '@/components/ui/motion';

export function LandingInsightSection() {
  const cards = [
    {
      badge: 'Siklus Sensor Antariksa',
      icon: <Satellite className="w-4 h-4 text-orange-600" />,
      value: '3 Jam',
      title: 'Pembaruan Downlink NASA FIRMS',
      desc: 'Sensor VIIRS pada satelit NOAA-20 dan Suomi-NPP memindai Kalimantan setiap 3 jam sekali untuk menangkap anomali termal sedini mungkin sebelum kobaran meluas.',
    },
    {
      badge: 'Kerentanan Lahan Gambut',
      icon: <Flame className="w-4 h-4 text-red-600" />,
      value: '4 Meter',
      title: 'Kedalaman Titik Api Bawah Tanah',
      desc: 'Kebakaran lahan gambut Kalimantan menjalar di bawah permukaan tanah tanpa api terbuka. Deteksi suhu tinggi dan verifikasi koordinat akurat mutlak diperlukan untuk pemadaman efektif.',
      stagger: true, // Offsets down on desktop to break uniform grid rhythm
    },
    {
      badge: 'Integritas Laporan Lapangan',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
      value: '100%',
      title: 'Kamera Langsung Terkunci GPS',
      desc: 'Mencegah laporan fiktif dan foto arsip lawas. Setiap foto warga wajib diambil secara live dari kamera HP dengan koordinat satelit dan cap waktu otomatis.',
    },
  ];

  return (
    <section id="tentang" className="bg-neutral-50/70 py-20 sm:py-28 lg:py-36 border-b border-neutral-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-3">
          <BlurReveal delay={0.05}>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-600">
              Kondisi Lapangan & Arsitektur Solusi
            </p>
          </BlurReveal>

          <StaggerTextContainer
            delayChildren={0.1}
            staggerChildren={0.04}
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight leading-[1.12]"
          >
            <SplitText text="Krisis Kebakaran Hutan Kalimantan Bukan Sekadar Asap." />
          </StaggerTextContainer>

          <BlurReveal delay={0.25}>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal max-w-2xl">
              Lahan gambut tropis menyimpan cadangan karbon raksasa. Menghubungkan pengamatan antariksa
              dan kesaksian warga di darat adalah kunci memutus rantai karhutla menahun.
            </p>
          </BlurReveal>
        </div>

        {/* 3-Card Staggered Layout (Breaks uniform grid rhythm inspired by Veternity/Ordina) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {cards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={`bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 hover:border-neutral-300 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[340px] text-left ${
                card.stagger ? 'mt-0 md:mt-10 lg:mt-12' : ''
              }`}
            >
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-neutral-200 bg-neutral-50 mb-8">
                  {card.icon}
                  <span className="text-[11px] font-semibold text-neutral-700">{card.badge}</span>
                </div>

                <div className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-900 tracking-tighter leading-none mb-3">
                  {card.value}
                </div>

                <h3 className="text-base font-bold text-neutral-800 tracking-tight">
                  {card.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mt-6 pt-4 border-t border-neutral-100">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
