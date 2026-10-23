import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselSlide {
  src: string;
  title: string;
  description: string;
}

const SLIDES: CarouselSlide[] = [
  {
    src: "/assets/auth/Wildfire%20Operations%20Control%20Room.png",
    title: "Pemantauan Real-Time Garis Api Karhutla",
    description:
      "Integrasi citra satelit NASA FIRMS dan orkestrasi peringatan dini bencana karhutla se-Pulau Kalimantan dalam satu dasbor intelijen terpadu.",
  },
  {
    src: "/assets/auth/Wildfire%20Crew%20Battling%20Forest%20Flames.png",
    title: "Aksi Terkoordinasi Regu Lapangan",
    description:
      "Relawan terlatih menerima penugasan posko secara real-time dengan verifikasi foto geospasial dan titik koordinat presisi tinggi.",
  },
  {
    src: "/assets/auth/Wildfire%20Monitoring%20Overlook.png",
    title: "Deteksi Bahaya Berbasis Komunitas",
    description:
      "Warga dapat melaporkan kepulan asap menggunakan kamera langsung perangkat dan GPS otomatis sebelum api merambat ke permukiman.",
  },
  {
    src: "/assets/auth/Wildfire%20Command%20Centre%20in%20Action.png",
    title: "Komando Evakuasi & Keselamatan Warga",
    description:
      "Akses cepat nomor darurat, panduan 5 langkah evakuasi kilat, dan data terbuka untuk ketangguhan daerah se-Pulau Kalimantan.",
  },
];

export function AuthHeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, []);

  const previousSlide = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const slide = SLIDES[current];

  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-neutral-950 select-none">
      {/* Background Images with smooth opacity blend */}
      {SLIDES.map((item, index) => (
        <div
          key={item.src}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === current ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
          }`}
          style={{ transitionProperty: "opacity, transform" }}
        >
          <img
            src={item.src}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      {/* Modern Gradient Overlays for High Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />

      {/* Foreground Content - Clean & Minimalist like SeaPedia */}
      <div className="relative z-10 flex h-full w-full flex-col justify-end p-12 text-white">
        <div className="max-w-lg space-y-3 pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/80">
            FIREZONE
          </p>
          <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-md">
            {slide.title}
          </h2>
          <p className="text-sm xl:text-base leading-relaxed text-neutral-200 drop-shadow">
            {slide.description}
          </p>
        </div>

        {/* Footer Navigation & Indicators */}
        <div className="flex items-center justify-between pt-6 border-t border-white/15">
          {/* Dot Indicators */}
          <div className="flex items-center gap-2">
            {SLIDES.map((item, index) => (
              <button
                key={item.src}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Beralih ke slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  current === index
                    ? "w-8 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          {/* Previous & Next Control Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={previousSlide}
              aria-label="Slide sebelumnya"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md transition hover:bg-white hover:text-neutral-900 active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Slide berikutnya"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md transition hover:bg-white hover:text-neutral-900 active:scale-95"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
