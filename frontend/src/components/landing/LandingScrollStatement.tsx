import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Satellite, Camera, Send, MapPin, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function LandingScrollStatement() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const phrases = [
        { id: 'w1', color: '#ea580c' }, // Flame orange
        { id: 'w2', color: '#0284c7' }, // Clean sky blue (warga)
        { id: 'w3', color: '#059669' }, // Forest emerald (BPBD / pemadam)
      ];
      const baseColor = '#9ca3af'; // neutral-400

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Initial state of floating context objects
        gsap.set('.scroll-obj', { opacity: 0, scale: 0.9, y: 35, filter: 'blur(10px)' });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=300%',
            scrub: 1.5, // 1.5s smoothing for silky Ordina feel
            pin: true,
          },
        });

        // Phase 1: Sensor Satelit
        tl.to('#w1', { color: phrases[0].color, duration: 1.4, ease: 'power3.out' });
        tl.to(
          '.phrase1-obj',
          { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.4, ease: 'expo.out', stagger: 0.1 },
          '<'
        );
        tl.to({}, { duration: 1.5 }); // Hold Phase 1

        // Transition Phase 1 -> Phase 2
        tl.to('.phrase1-obj', {
          opacity: 0,
          y: -20,
          scale: 0.95,
          filter: 'blur(10px)',
          duration: 1,
          ease: 'power3.inOut',
          stagger: 0.05,
        });
        tl.to('#w1', { color: baseColor, duration: 1 }, '<');

        // Phase 2: Kamera Warga
        tl.to('#w2', { color: phrases[1].color, duration: 1.4, ease: 'power3.out' }, '<0.2');
        tl.to(
          '.phrase2-obj',
          { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.4, ease: 'expo.out', stagger: 0.1 },
          '<'
        );
        tl.to({}, { duration: 1.5 }); // Hold Phase 2

        // Transition Phase 2 -> Phase 3
        tl.to('.phrase2-obj', {
          opacity: 0,
          y: -20,
          scale: 0.95,
          filter: 'blur(10px)',
          duration: 1,
          ease: 'power3.inOut',
          stagger: 0.05,
        });
        tl.to('#w2', { color: baseColor, duration: 1 }, '<');

        // Phase 3: Disposisi BPBD
        tl.to('#w3', { color: phrases[2].color, duration: 1.4, ease: 'power3.out' }, '<0.2');
        tl.to(
          '.phrase3-obj',
          { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.4, ease: 'expo.out', stagger: 0.1 },
          '<'
        );
        tl.to({}, { duration: 2 }); // Hold Phase 3
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('#w1', { color: phrases[0].color });
        gsap.set('#w2', { color: phrases[1].color });
        gsap.set('#w3', { color: phrases[2].color });
        gsap.set('.scroll-obj', { display: 'none' });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-neutral-50/80 text-neutral-900 relative overflow-hidden select-none border-y border-neutral-200"
    >
      {/* Massive Typographical Statement */}
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <p className="text-2xl sm:text-4xl lg:text-[44px] font-heading font-semibold text-neutral-400 leading-[1.35] tracking-tight transition-colors duration-300">
          Firezone menyatukan{' '}
          <span id="w1" className="transition-colors duration-300">
            anomali sensor satelit antariksa
          </span>
          ,{' '}
          <span id="w2" className="transition-colors duration-300">
            bukti visual kamera warga
          </span>
          , dan{' '}
          <span id="w3" className="transition-colors duration-300">
            disposisi cepat regu BPBD
          </span>{' '}
          menjadi satu koordinasi tanggap darurat yang terpadu.
        </p>
      </div>

      {/* Floating Context Objects Container */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* ================= PHRASE 1: SENSOR SATELIT ================= */}
        <div className="scroll-obj phrase1-obj absolute top-[12%] left-[6%] md:left-[12%] bg-white/95 backdrop-blur-xl border border-neutral-200/90 shadow-xl shadow-neutral-900/5 rounded-2xl p-4 flex items-center gap-3 rotate-[-4deg]">
          <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
            <Satellite className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-neutral-900">Sensor NASA VIIRS 375m</div>
            <div className="text-[11px] text-neutral-500">Orbit LEO • Akurasi Suhu 0.1K</div>
          </div>
        </div>

        <div className="scroll-obj phrase1-obj absolute bottom-[18%] right-[6%] md:right-[14%] bg-white/95 backdrop-blur-xl border border-neutral-200/90 shadow-xl shadow-neutral-900/5 rounded-2xl p-4 flex flex-col gap-1 text-left rotate-[3deg] max-w-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-orange-600">
            <MapPin className="w-4 h-4" />
            <span>Klaster Termal Terdeteksi</span>
          </div>
          <div className="text-[11px] text-neutral-600 leading-relaxed">
            Koordinat otomatis diteruskan dari sensor downlink FIRMS tanpa jeda entri manual.
          </div>
        </div>

        {/* ================= PHRASE 2: KAMERA WARGA ================= */}
        <div className="scroll-obj phrase2-obj absolute top-[14%] right-[6%] md:right-[12%] bg-white/95 backdrop-blur-xl border border-neutral-200/90 shadow-xl shadow-neutral-900/5 rounded-2xl p-3 flex gap-3 rotate-[4deg]">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=80"
            alt="Dokumentasi Warga"
            className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover"
          />
          <div className="flex flex-col justify-between py-1 text-left">
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              <Camera className="w-3 h-3 text-blue-600" />
              <span>Kamera Live GPS</span>
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-900">Verifikasi Anti-Hoax</div>
              <div className="text-[10px] text-neutral-500">Tanpa Akses Galeri HP</div>
            </div>
          </div>
        </div>

        <div className="scroll-obj phrase2-obj absolute bottom-[16%] left-[6%] md:left-[14%] bg-blue-50/90 border border-blue-200 shadow-xl shadow-neutral-900/5 rounded-full px-5 py-3 flex items-center gap-2.5 rotate-[-5deg]">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-xs md:text-sm font-bold text-blue-900">
            Metadata Koordinat & Cap Waktu Terkunci
          </span>
        </div>

        {/* ================= PHRASE 3: DISPOSISI BPBD & WHATSAPP ================= */}
        <div className="scroll-obj phrase3-obj absolute top-[15%] left-[8%] md:left-[15%] bg-white/95 backdrop-blur-xl border border-emerald-200 shadow-xl shadow-neutral-900/5 rounded-2xl p-4 flex items-center gap-3 rotate-[-3deg] text-left">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-neutral-900">Disposisi Regu Lapangan</div>
            <div className="text-[11px] text-emerald-700 font-semibold">Terkirim ke WhatsApp Personel</div>
          </div>
        </div>

        <div className="scroll-obj phrase3-obj absolute bottom-[18%] right-[8%] md:right-[15%] bg-white/95 backdrop-blur-xl border border-neutral-200/90 shadow-xl shadow-neutral-900/5 rounded-2xl p-4 max-w-xs rotate-[4deg] text-left">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 mb-1">
            Status Operasional Posko
          </div>
          <div className="text-xs text-neutral-600 leading-relaxed">
            Tim terdekat diarahkan langsung ke koordinat peta navigasi dalam hitungan menit.
          </div>
        </div>
      </div>
    </section>
  );
}
