import { useState, useId } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Phone,
  Mail,
  ChevronDown,
  Flame,
  Satellite,
  Clock,
  Sliders,
  ArrowRight,
  Camera,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';

export const Route = createFileRoute('/faq')({
  component: FaqPage,
});

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'Apa itu platform Firezone?',
    answer:
      'Firezone adalah platform pemantauan spasial terbuka dan koordinasi tanggap darurat kebakaran hutan dan lahan (Karhutla) di Kalimantan. Sistem ini menggabungkan data anomali termal satelit NASA FIRMS dengan validasi foto lapangan berkamera langsung dari warga untuk membantu regu pemadam BPBD dan Masyarakat Peduli Api (MPA).',
  },
  {
    question: 'Seberapa sering data satelit NASA diperbarui?',
    answer:
      'Data disinkronkan secara otomatis setiap 3 jam langsung dari satelit orbit kutub NASA FIRMS (sensor VIIRS pada satelit Suomi NPP dan NOAA-20) dengan resolusi spasial tinggi 375 meter per piksel.',
  },
  {
    question: 'Bagaimana Firezone memastikan laporan warga bebas hoax?',
    answer:
      'Firezone menerapkan protokol Mandatory Live Camera tanpa akses galeri file. Laporan hanya dapat dibuat dengan memotret langsung dari kamera perangkat di lokasi kejadian, di mana koordinat satelit GPS dan penanda waktu (timestamp) dikunci otomatis secara kriptografis.',
  },
  {
    question: 'Apa itu algoritma DBSCAN dan mengapa titik api dikelompokkan?',
    answer:
      'DBSCAN (Density-Based Spatial Clustering of Applications with Noise) adalah algoritma spasial yang otomatis menggabungkan titik-titik panas yang berdekatan menjadi satu "Kluster Area Pantau". Dengan cara ini, posko komando BPBD dapat menugaskan armada pemadam ke satu garis api terpadu daripada menangani puluhan titik api acak yang terpisah.',
  },
  {
    question: 'Apakah tutupan awan atau asap tebal menghalangi deteksi satelit?',
    answer:
      'Sensor inframerah gelombang menengah (MWIR 3.9 µm) mampu menembus kabut asap tipis hingga sedang. Untuk kondisi awan badai tebal yang menutupi sensor optik, Firezone memanfaatkan algoritma Persistensi 7 Hari dan laporan warga sekitar untuk meminimalkan titik buta (blindspot).',
  },
  {
    question: 'Bagaimana regu relawan dan pemadam menerima instruksi tugas?',
    answer:
      'Saat posko BPBD menetapkan penugasan pada suatu kluster kebakaran, sistem Firezone secara otomatis mengirimkan lembar tugas terenkripsi langsung ke nomor WhatsApp relawan melalui integrasi WhatsApp Gateway resmi posko siaga.',
  },
  {
    question: 'Apakah seluruh data dan peta di Firezone dapat diakses gratis oleh masyarakat?',
    answer:
      'Ya, seluruh peta sebaran titik panas, status siaga kebencanaan, dan riwayat laporan terverifikasi dapat diakses 100% gratis dan terbuka bagi publik tanpa perlu mendaftar akun atau berlangganan.',
  },
  {
    question: 'Bagaimana cara warga melaporkan titik api di sekitarnya?',
    answer:
      'Cukup buka menu "Kirim Laporan" di pojok kanan atas, izinkan akses kamera dan lokasi GPS perangkat, ambil foto kobaran atau kepulan asap gambut, beri keterangan arah angin/kondisi parit, lalu tekan kirim. Laporan Anda langsung diteruskan ke radar posko BPBD.',
  },
];

function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  // ============================================================
  // Interactive Risk Simulator State (Metodologi Section)
  // ============================================================
  const [simHotspots, setSimHotspots] = useState<number>(8); // 1 - 25
  const [simDays, setSimDays] = useState<number>(3); // 1 - 7
  const [simFrp, setSimFrp] = useState<number>(28); // 5 - 80 MW
  const [simDistance, setSimDistance] = useState<number>(2.4); // 0.5 - 12 km
  const [simReports, setSimReports] = useState<number>(2); // 0 - 5 laporan

  // Formulasi Matematika Riil Firezone (Sesuai clustering.py & hotspots.service.ts)
  const normActivity = Math.min(100, (simHotspots / 15) * 100);
  const normPersistence = Math.min(100, (simDays / 4) * 100);
  const normIntensity = Math.min(100, (simFrp / 50) * 100);

  const baseScore = Number(
    (0.4 * normActivity + 0.35 * normPersistence + 0.25 * normIntensity).toFixed(1)
  );

  let proximityUrgency = 0.0;
  if (simDistance < 3.0) {
    proximityUrgency = 8.0;
  } else if (simDistance <= 7.0) {
    proximityUrgency = 4.0;
  }

  let citizenBoost = 0.0;
  if (simReports === 1) citizenBoost = 3.0;
  else if (simReports === 2) citizenBoost = 6.0;
  else if (simReports >= 3) citizenBoost = Math.min(10.0, 6.0 + (simReports - 2) * 1.5);

  const finalScore = Math.min(100.0, Number((baseScore + proximityUrgency + citizenBoost).toFixed(1)));

  let priorityBadge = {
    code: 'P3',
    label: 'Waspada Ringan',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
    desc: 'Pemantauan anomali satelit berkala tanpa pengerahan armada darurat.',
  };

  if (finalScore >= 80.0) {
    priorityBadge = {
      code: 'P1',
      label: 'Prioritas Tinggi',
      color: 'bg-red-50 text-red-800 border-red-200',
      dot: 'bg-red-500',
      desc: 'Peringatan bahaya kritis! Dispatch armada pemadam BPBD dan sekat kanal segera.',
    };
  } else if (finalScore >= 65.0) {
    priorityBadge = {
      code: 'P2',
      label: 'Perhatian Meningkat',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
      desc: 'Siaga regu Masyarakat Peduli Api (MPA), patroli darat, dan kesiapan pompa air.',
    };
  }

  const hotspotsSliderId = useId();
  const daysSliderId = useId();
  const frpSliderId = useId();
  const distanceSliderId = useId();
  const reportsSliderId = useId();

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-orange-100 selection:text-orange-900">
      <TopNavbar />

      <main className="pt-28 pb-20 sm:pt-36 sm:pb-28">
        {/* ============================================================ */}
        {/* SECTION 1: FAQ SECTION (LAYOUT MIRIP REFERENSI AKARMAKMUR) */}
        {/* ============================================================ */}
        <div className="w-full bg-white px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
            {/* Kolom Kiri: Sticky Title & Kontak Posko */}
            <div className="w-full lg:w-5/12 flex flex-col items-center lg:items-start text-center lg:text-left lg:sticky lg:top-32 h-fit">
              <h1 className="text-3xl sm:text-5xl font-heading font-bold text-neutral-900 mb-6 tracking-tight leading-tight">
                Pertanyaan &<br className="hidden lg:block" />Jawaban
              </h1>
              <p className="text-neutral-500 mb-10 text-base sm:text-lg leading-relaxed">
                Temukan jawaban dari pertanyaan yang paling sering diajukan mengenai sistem kerja FIREZONE. Jika masih membutuhkan bantuan atau koordinasi siaga darurat, hubungi posko kami:
              </p>

              <div className="space-y-4 flex flex-col items-center lg:items-start w-full sm:w-auto">
                <a
                  href="tel:117"
                  className="flex items-center gap-4 text-neutral-700 hover:text-orange-600 transition-colors cursor-pointer group w-fit"
                >
                  <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center shadow-xs border border-neutral-200/90 group-hover:border-orange-500/30 group-hover:bg-orange-50/60 transition-all">
                    <Phone className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Hotline Bebas Pulsa Posko BPBD
                    </span>
                    <span className="font-heading font-bold text-neutral-900 group-hover:text-orange-600 transition">
                      117 / +62 811 5200 117
                    </span>
                  </div>
                </a>

                <a
                  href="mailto:posko@firezone.kalbarprov.go.id"
                  className="flex items-center gap-4 text-neutral-700 hover:text-orange-600 transition-colors cursor-pointer group w-fit"
                >
                  <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center shadow-xs border border-neutral-200/90 group-hover:border-orange-500/30 group-hover:bg-orange-50/60 transition-all">
                    <Mail className="w-5 h-5 text-neutral-700 group-hover:text-orange-600 transition" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Surel Resmi Pengaduan
                    </span>
                    <span className="font-heading font-semibold text-neutral-900 group-hover:text-orange-600 transition">
                      posko@firezone.id
                    </span>
                  </div>
                </a>

                <div className="flex items-center gap-4 text-neutral-700 group w-fit">
                  <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center shadow-xs border border-neutral-200/90">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Dispatch Komando WhatsApp
                    </span>
                    <span className="font-heading font-semibold text-neutral-900">
                      Aktif 24 Jam Reaksi Cepat
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Numbered FAQ Accordion Cards (AkarMakmur Style) */}
            <div className="w-full lg:w-7/12 flex flex-col gap-4 text-left">
              {FAQS.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={index}
                    className={`bg-white border rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer shadow-xs ${
                      isOpen
                        ? 'border-orange-600 shadow-md ring-1 ring-orange-600/10'
                        : 'border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
                    }`}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  >
                    <div className="px-6 py-5 flex items-center gap-4">
                      <span
                        className={`text-sm font-bold w-6 shrink-0 transition-colors font-mono ${
                          isOpen ? 'text-orange-600 font-extrabold' : 'text-neutral-400'
                        }`}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3
                        className={`font-heading font-semibold flex-1 transition-colors text-base sm:text-lg leading-snug ${
                          isOpen ? 'text-neutral-900 font-bold' : 'text-neutral-700'
                        }`}
                      >
                        {faq.question}
                      </h3>
                      <div
                        className={`shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-orange-600' : 'text-neutral-400'
                        }`}
                      >
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </div>

                    <div
                      className="px-6 overflow-hidden transition-all duration-300 ease-in-out"
                      style={{ maxHeight: isOpen ? '500px' : '0px', opacity: isOpen ? 1 : 0 }}
                    >
                      <p className="text-neutral-600 pb-5 pt-2 sm:pl-10 border-t border-neutral-100 leading-relaxed text-sm sm:text-base font-normal">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 2: METODOLOGI PERHITUNGAN & SIMULATOR DI BAWAH FAQ */}
        {/* ============================================================ */}
        <section className="mt-20 sm:mt-28 border-t border-neutral-200 pt-16 sm:pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-neutral-200/90 bg-neutral-50/70 p-6 sm:p-10 lg:p-12 shadow-sm">
            {/* Header Blueprint */}
            <div className="max-w-3xl text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-100/90 text-orange-800 text-[11px] font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Transparansi Algoritma & Formula Perhitungan</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight">
                Bagaimana Skor Risiko Area Pantau Dihitung?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
                Skor akhir risiko bencana (skala 0 hingga 100) ditentukan oleh formula matematis terbuka yang
                menggabungkan <strong className="text-neutral-900 font-semibold">Base Score Satelit NASA</strong>,{' '}
                <strong className="text-neutral-900 font-semibold">jarak ke permukiman warga</strong>, dan{' '}
                <strong className="text-neutral-900 font-semibold">bukti verifikasi kamera HP warga</strong>.
              </p>
            </div>

            {/* Formula Math Box */}
            <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
                Persamaan Matematis Baku
              </p>
              <div className="font-mono text-sm sm:text-base font-bold text-neutral-900 overflow-x-auto py-1">
                Final Risk Score = min(100, Base Score + Proximity Urgency + Citizen Boost)
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Dimana Base Score = (0.40 × Aktivitas Termal) + (0.35 × Persistensi 7 Hari) + (0.25 × Intensitas FRP)
              </p>
            </div>

            {/* 3 Kartu Komponen Bobot Satelit */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
              <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                    Bobot 40%
                  </span>
                  <Flame className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="font-heading font-bold text-base text-neutral-900">
                  Kerapatan Aktivitas Termal
                </h3>
                <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                  Frekuensi titik panas satelit aktif 24 jam terakhir dalam 1 kluster DBSCAN. Dinormalisasi hingga batas maksimal 15 titik api.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Bobot 35%
                  </span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="font-heading font-bold text-base text-neutral-900">
                  Persistensi Gambut (7 Hari)
                </h3>
                <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                  Konsistensi hari api terdeteksi dalam sepekan. Api yang menyala &gt;3 hari mengindikasikan bara tanah gambut dalam yang sulit padam.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">
                    Bobot 25%
                  </span>
                  <Satellite className="w-4 h-4 text-red-600" />
                </div>
                <h3 className="font-heading font-bold text-base text-neutral-900">
                  Intensitas Radiasi FRP
                </h3>
                <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                  Fire Radiative Power (Megawatt/MW). Mengukur daya pelepasan energi panas pembakaran untuk memetakan kecepatan laju api.
                </p>
              </div>
            </div>

            {/* Interactive Simulator Cockpit */}
            <div className="mt-10 rounded-2xl bg-white border border-neutral-300/90 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5 text-left">
                <div>
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-orange-600" />
                    <h3 className="font-heading font-bold text-lg text-neutral-900">
                      Simulator Interaktif Skor Risiko Bencana
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Uji coba menggeser parameter di bawah untuk membuktikan bagaimana algoritma Firezone menentukan status P1, P2, atau P3 secara objektif.
                  </p>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 text-xs font-semibold text-neutral-700">
                  <span>Kalkulasi Real-Time</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Kolom Slider Kontrol */}
                <div className="lg:col-span-7 space-y-5 text-left">
                  {/* Slider 1: Hotspot Count */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <label htmlFor={hotspotsSliderId} className="text-neutral-700">Jumlah Titik Panas Satelit (24 Jam)</label>
                      <span className="font-mono text-orange-600 font-bold">{simHotspots} Titik</span>
                    </div>
                    <input
                      id={hotspotsSliderId}
                      type="range"
                      min={1}
                      max={25}
                      value={simHotspots}
                      onChange={(e) => setSimHotspots(Number(e.target.value))}
                      className="w-full accent-orange-600 cursor-pointer"
                    />
                  </div>

                  {/* Slider 2: Persistence Days */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <label htmlFor={daysSliderId} className="text-neutral-700">Persistensi Hari Deteksi (dari 7 Hari)</label>
                      <span className="font-mono text-amber-600 font-bold">{simDays} Hari</span>
                    </div>
                    <input
                      id={daysSliderId}
                      type="range"
                      min={1}
                      max={7}
                      value={simDays}
                      onChange={(e) => setSimDays(Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>

                  {/* Slider 3: Radiative Power (FRP) */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <label htmlFor={frpSliderId} className="text-neutral-700">Intensitas Radiasi Termal (FRP)</label>
                      <span className="font-mono text-red-600 font-bold">{simFrp} MW</span>
                    </div>
                    <input
                      id={frpSliderId}
                      type="range"
                      min={5}
                      max={80}
                      value={simFrp}
                      onChange={(e) => setSimFrp(Number(e.target.value))}
                      className="w-full accent-red-600 cursor-pointer"
                    />
                  </div>

                  {/* Slider 4: Jarak ke Permukiman */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <label htmlFor={distanceSliderId} className="text-neutral-700">Jarak ke Permukiman Penduduk</label>
                      <span className="font-mono text-neutral-900 font-bold">{simDistance} km</span>
                    </div>
                    <input
                      id={distanceSliderId}
                      type="range"
                      min={0.5}
                      max={12}
                      step={0.1}
                      value={simDistance}
                      onChange={(e) => setSimDistance(Number(e.target.value))}
                      className="w-full accent-neutral-800 cursor-pointer"
                    />
                    <p className="text-[11px] text-neutral-500 mt-1">
                      {simDistance < 3.0
                        ? '🚨 < 3 km: Ancaman langsung permukiman (+8.0 Poin)'
                        : simDistance <= 7.0
                        ? '⚠️ 3 - 7 km: Bahaya paparan kabut asap (+4.0 Poin)'
                        : '🛡️ > 7 km: Area hutan/gambut pedalaman (0 Poin)'}
                    </p>
                  </div>

                  {/* Slider 5: Laporan Kamera Warga */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <label htmlFor={reportsSliderId} className="text-neutral-700">Validasi Laporan Kamera HP Warga</label>
                      <span className="font-mono text-blue-600 font-bold">{simReports} Laporan</span>
                    </div>
                    <input
                      id={reportsSliderId}
                      type="range"
                      min={0}
                      max={5}
                      value={simReports}
                      onChange={(e) => setSimReports(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                    <p className="text-[11px] text-neutral-500 mt-1">
                      {simReports === 0
                        ? 'Belum ada bukti foto kamera warga'
                        : `Dikonfirmasi oleh ${simReports} warga sekitar (+${citizenBoost} Poin)`}
                    </p>
                  </div>
                </div>

                {/* Kolom Hasil & Dashboard Gauge */}
                <div className="lg:col-span-5 bg-neutral-50 rounded-2xl p-6 border border-neutral-200 text-left flex flex-col justify-between h-full space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                        Hasil Skor Algoritma
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${priorityBadge.color}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${priorityBadge.dot}`} />
                        <span>{priorityBadge.code} • {priorityBadge.label}</span>
                      </span>
                    </div>

                    {/* Skor Utama */}
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="font-heading text-5xl font-extrabold text-neutral-900 tabular-nums">
                        {finalScore}
                      </span>
                      <span className="text-neutral-400 font-semibold text-lg">/ 100</span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                      {priorityBadge.desc}
                    </p>
                  </div>

                  {/* Rincian Poin */}
                  <div className="space-y-2 pt-4 border-t border-neutral-200 text-xs">
                    <div className="flex justify-between text-neutral-600">
                      <span>Base Score Satelit Murni:</span>
                      <strong className="font-mono text-neutral-900">{baseScore}</strong>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Proximity Urgency (&lt;7 km):</span>
                      <strong className="font-mono text-neutral-900">+{proximityUrgency}</strong>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Citizen Ground-Truth Boost:</span>
                      <strong className="font-mono text-blue-600">+{citizenBoost}</strong>
                    </div>
                  </div>

                  <Link
                    to="/map"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 transition"
                  >
                    <span>Bandingkan dengan Peta Real-Time</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 3: CALL TO ACTION BOTTOM DECK */}
        {/* ============================================================ */}
        <section className="mt-20 sm:mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-neutral-900 text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">
                Ada Pertanyaan Teknis Lain atau Temuan Lapangan?
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                Pantau radar sebaran api terkini di Kalimantan atau laporkan kejadian asap langsung
                menggunakan kamera ponsel Anda untuk percepatan penanganan regu BPBD.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/map"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition"
                >
                  <Flame className="w-4 h-4" />
                  <span>Buka Peta Sebaran Api</span>
                </Link>
                <Link
                  to="/community/create"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
                >
                  <Camera className="w-4 h-4 text-orange-400" />
                  <span>Kirim Laporan Kamera HP</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
