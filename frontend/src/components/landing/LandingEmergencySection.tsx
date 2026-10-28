import { Link } from '@tanstack/react-router';
import { PhoneCall, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';
import { StaggerTextContainer, SplitText, BlurReveal } from '@/components/ui/motion';

export function LandingEmergencySection() {
  const emergencyHotlines = [
    {
      number: '113',
      name: 'Pemadam Kebakaran',
      label: 'Penanganan Api Karhutla',
      desc: 'Disposisi unit armada & pompa damkar',
      accent: 'border-red-200 hover:border-red-300',
      numColor: 'text-red-600',
      badge: 'bg-red-50 text-red-700 border-red-200/80',
    },
    {
      number: '115',
      name: 'Basarnas / SAR',
      label: 'Penyelamatan Warga',
      desc: 'Evakuasi korban terjebak api & kabut',
      accent: 'border-amber-200 hover:border-amber-300',
      numColor: 'text-amber-600',
      badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
    },
    {
      number: '110',
      name: 'Kepolisian RI',
      label: 'Keamanan & Penegakan',
      desc: 'Penyekatan jalur & investigasi lahan',
      accent: 'border-blue-200 hover:border-blue-300',
      numColor: 'text-blue-600',
      badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
    },
    {
      number: '119',
      name: 'Ambulans Darurat',
      label: 'Pertolongan Medis ISPA',
      desc: 'Bantuan oksigen & rujukan rumah sakit',
      accent: 'border-emerald-200 hover:border-emerald-300',
      numColor: 'text-emerald-600',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    },
  ];

  return (
    <section className="bg-neutral-100/70 text-neutral-900 py-14 sm:py-18 border-y border-neutral-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Top Bar (Harmonious full-width flow) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-neutral-200">
          <div className="space-y-3 max-w-2xl text-left">
            <BlurReveal delay={0.05}>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-600">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>Saluran Siaga Nasional 24 Jam • Bebas Pulsa</span>
              </div>
            </BlurReveal>

            <StaggerTextContainer
              delayChildren={0.1}
              staggerChildren={0.03}
              className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 leading-tight"
            >
              <SplitText text="Posko Tanggap Darurat Bencana Karhutla." />
            </StaggerTextContainer>

            <BlurReveal delay={0.2}>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                Bila api mendekati permukiman atau kabut asap mencapai ambang berbahaya, segera
                hubungi posko tanggap darurat resmi tanpa perantara pulsa.
              </p>
            </BlurReveal>
          </div>

          <BlurReveal delay={0.3} className="shrink-0 text-left lg:text-right">
            <Link
              to="/emergency"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-neutral-800 bg-white border border-neutral-300 hover:bg-neutral-50 shadow-2xs transition active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-red-600" />
              <span>Panduan Protokol Evakuasi Mandiri</span>
              <ArrowRight className="w-4 h-4 text-neutral-500" />
            </Link>
          </BlurReveal>
        </div>

        {/* Full-Width Horizontal Emergency Hotline Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
          {emergencyHotlines.map((item) => (
            <a
              key={item.number}
              href={`tel:${item.number}`}
              className={`p-5 rounded-2xl bg-white border shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between min-h-[160px] text-left relative overflow-hidden ${item.accent}`}
            >
              {/* Top row */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${item.badge}`}
                >
                  {item.label}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 transition" />
              </div>

              {/* Big bold emergency number */}
              <div className="my-3">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`font-heading text-4xl sm:text-5xl font-black tracking-tight group-hover:scale-105 transition-transform origin-left ${item.numColor}`}
                  >
                    {item.number}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-medium">Bebas Pulsa</span>
                </div>
                <div className="text-sm font-bold text-neutral-800 mt-1">{item.name}</div>
              </div>

              {/* Bottom short action tip */}
              <div className="text-[11px] text-neutral-500 font-normal border-t border-neutral-100 pt-2 flex items-center justify-between">
                <span className="truncate">{item.desc}</span>
                <span className="text-neutral-900 font-semibold text-[10px] opacity-0 group-hover:opacity-100 transition shrink-0 ml-2">
                  Panggil →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
