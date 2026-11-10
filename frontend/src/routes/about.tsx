import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Shield,
  Satellite,
  Users,
  Radio,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Layers,
  Activity,
  HeartHandshake,
  Bell,
  Sparkles,
  Camera,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';

export const Route = createFileRoute('/about')({
  component: AboutPage,
});

function AboutPage() {
  const stats = [
    {
      value: '375 M',
      label: 'Resolusi Termal Satelit',
      detail: 'Sensor VIIRS NASA Suomi NPP & NOAA-20',
      icon: Satellite,
      color: 'text-orange-600 bg-orange-50 border-orange-200',
    },
    {
      value: '3 Jam',
      label: 'Sinkronisasi Anomali',
      detail: 'Pembaruan otomatis data hotspot orbit kutub',
      icon: Activity,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      value: '100% Live',
      label: 'Kamera Warga Valid',
      detail: 'Proteksi anti-hoax tanpa unggah galeri',
      icon: Camera,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      value: '5 Provinsi',
      label: 'Cakupan Kalimantan',
      detail: 'Kalbar, Kalteng, Kalsel, Kaltim, dan Kaltara',
      icon: MapPin,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
  ];

  const pillars = [
    {
      icon: Satellite,
      badge: 'Sensor Antariksa',
      title: 'Deteksi Dini NASA FIRMS',
      desc: 'Mengintegrasikan data anomali termal langsung dari satelit orbit rendah bumi (LEO). Sensor membaca pancaran energi radiasi api (Fire Radiative Power/FRP) untuk memperkirakan intensitas kebakaran bahkan sebelum asap tebal terlihat di darat.',
    },
    {
      icon: Layers,
      badge: 'Kecerdasan Spasial',
      title: 'Kluster Garis Api DBSCAN',
      desc: 'Titik-titik panas sporadis dikelompokkan secara matematis menjadi satu kesatuan kluster area terdampak. Posko komando dapat melihat arah rambatan api dan memetakan prioritas penanganan secara terpadu.',
    },
    {
      icon: Camera,
      badge: 'Verifikasi Anti-Hoax',
      title: 'Kamera Live Kriptografis',
      desc: 'Setiap laporan warga wajib diambil langsung menggunakan kamera perangkat di titik kejadian. Sistem mengunci koordinat GPS perangkat dan stempel waktu (timestamp) secara otomatis, mencegah penyebaran foto arsip atau manipulasi informasi.',
    },
    {
      icon: Bell,
      badge: 'Komando Lapangan',
      title: 'Disposisi Kilat Relawan',
      desc: 'Posko dapat langsung menerbitkan lembar tugas penanganan ke posko Masyarakat Peduli Api (MPA) dan relawan terdekat via Web Push Notification (FCM), lengkap dengan jalur navigasi dan panduan taktis.',
    },
  ];

  const stakeholders = [
    {
      icon: Users,
      role: 'Warga & Komunitas Lokal',
      tag: 'Sensor Sosial Wilayah',
      points: [
        'Memantau kondisi keamanan desa dari potensi ancaman titik api terdekat.',
        'Mengirimkan verifikasi visual foto lapangan dengan kamera langsung.',
        'Menerima peringatan dini bila jarak kebakaran mendekati permukiman.',
      ],
    },
    {
      icon: HeartHandshake,
      role: 'Relawan & Regu Pemadam',
      tag: 'Garda Terdepan di Garis Api',
      points: [
        'Menerima notifikasi lembar tugas disposisi dari posko secara seketika.',
        'Mengonfirmasi kesiapan armada dan melaporkan perkembangan pemadaman.',
        'Mengunggah bukti hasil penanganan lapangan terverifikasi.',
      ],
    },
    {
      icon: Radio,
      role: 'Posko Komando (BPBD & Manggala Agni)',
      tag: 'Pusat Analisis & Kebijakan',
      points: [
        'Memantau sebaran titik panas di 5 provinsi Kalimantan secara real-time.',
        'Menganalisis kluster api aktif dan tingkat kepercayaan sensor satelit.',
        'Mendelegasikan armada dan sumber daya pemadam secara efisien dan tepat sasaran.',
      ],
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-12 sm:space-y-16 pb-12 max-w-6xl mx-auto text-left">
        {/* Breadcrumb Ringkas */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-500">
          <Link to="/" className="hover:text-neutral-900 transition">
            Beranda
          </Link>
          <span>/</span>
          <span className="font-semibold text-neutral-900">Tentang FIREZONE</span>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-orange-50/70 via-white to-white border border-orange-200/60 p-6 sm:p-10 md:p-12 shadow-xs">
          <div className="relative z-10 max-w-3xl space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-orange-200 text-orange-800 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Inisiatif Pemantauan Spasial Terbuka Karhutla</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-extrabold text-neutral-900 tracking-tight leading-tight">
              Menjaga Hutan Gambut & Langit Kalimantan
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
              FIREZONE adalah platform pemantauan spasial terbuka dan koordinasi tanggap darurat
              kebakaran hutan dan lahan (Karhutla) di Kalimantan. Kami menjembatani data satelit
              antariksa NASA FIRMS dengan ketanggapan warga lokal dan kesiapsiagaan posko regu
              pemadam di lapangan.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/map"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-xs transition"
              >
                <span>Buka Peta Sebaran Api</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/faq"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 font-bold text-xs sm:text-sm transition"
              >
                <span>Metodologi & Algoritma</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Highlight Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="bg-white rounded-2xl border border-neutral-200/90 p-4 sm:p-5 shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xl sm:text-2xl font-black text-neutral-900 block font-heading">
                      {item.value}
                    </span>
                    <h3 className="text-xs font-bold text-neutral-800 mt-0.5">{item.label}</h3>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-500 mt-2 pt-2 border-t border-neutral-100 font-normal">
                  {item.detail}
                </p>
              </div>
            );
          })}
        </section>

        {/* Latar Belakang & Masalah Gambut */}
        <section className="space-y-4">
          <div className="max-w-2xl space-y-1.5">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Latar Belakang
            </span>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-neutral-900">
              Mengapa Penanganan Karhutla di Kalimantan Membutuhkan FIREZONE?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-sm font-bold text-neutral-900">Karakter Api Lahan Gambut</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Kebakaran di lahan gambut sering membara di bawah lapisan tanah tanpa api terbuka.
                Jika tidak terdeteksi sejak dini dari anomali suhu satelit dan validasi darat, api
                dapat memicu kabut asap tebal berminggu-minggu yang berbahaya bagi pernapasan anak
                dan lansia.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-sm font-bold text-neutral-900">Titik Buta Tutupan Awan</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Sensor optik satelit memiliki batasan saat berhadapan dengan awan hujan tropis atau
                jeda rotasi orbit. Di sinilah peran mata warga di lapangan menjadi penentu utama
                untuk mengonfirmasi apakah asap telah terlihat di cakrawala desa.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-sm font-bold text-neutral-900">Bahaya Hoax Foto Lama</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Media sosial kerap dibanjiri foto kebakaran lama yang disebarkan ulang tanpa konteks,
                menguras energi tim tanggap darurat yang memeriksa laporan palsu. Protokol kamera live
                FIREZONE memutus rantai disinformasi ini.
              </p>
            </div>
          </div>
        </section>

        {/* 4 Pilar Teknologi */}
        <section className="space-y-4">
          <div className="max-w-2xl space-y-1.5">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Arsitektur Sistem
            </span>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-neutral-900">
              4 Pilar Solusi Teknologi Terpadu
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-normal">
              Kombinasi data penginderaan jauh antariksa, algoritma pengelompokan spasial, dan
              koordinasi lapangan berbasis web modern.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 space-y-3 shadow-2xs hover:border-orange-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200/70 text-orange-700 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-orange-700 bg-orange-50/80 px-2 py-0.5 rounded-md border border-orange-200/60">
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-900">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Ekosistem Pengguna */}
        <section className="space-y-4">
          <div className="max-w-2xl space-y-1.5">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Kolaborasi Multi-Pihak
            </span>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-neutral-900">
              Tiga Garda Pelindung Kalimantan
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-normal">
              Platform dirancang untuk mengakomodasi kebutuhan spesifik setiap pihak yang terlibat
              dalam siklus penanggulangan bencana.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {stakeholders.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.role}
                  className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center border border-neutral-200">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 leading-snug">{s.role}</h3>
                      <span className="text-[10px] font-semibold text-neutral-500 block mt-0.5">
                        {s.tag}
                      </span>
                    </div>
                    <ul className="space-y-2 pt-2 border-t border-neutral-100">
                      {s.points.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-neutral-600 leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Sumber Data & Transparansi */}
        <section className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-800 text-neutral-300 text-[11px] font-semibold border border-neutral-700">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Transparansi & Akurasi Data</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
              Kemitraan Sumber Data Terbuka
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
              FIREZONE menjunjung tinggi keterbukaan informasi publik geospasial demi mendukung
              riset lingkungan, penegakan hukum tata kelola hutan, dan keselamatan masyarakat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-neutral-800/80 border border-neutral-700/80">
              <p className="text-xs font-bold text-white">NASA FIRMS / LANCE</p>
              <p className="text-[11px] text-neutral-400 mt-1">
                Data anomali termal satelit Suomi NPP dan NOAA-20 resolusi 375m.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-800/80 border border-neutral-700/80">
              <p className="text-xs font-bold text-white">Badan Informasi Geospasial</p>
              <p className="text-[11px] text-neutral-400 mt-1">
                Batas administrasi provinsi, kabupaten, dan tutupan lahan Kalimantan.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-800/80 border border-neutral-700/80">
              <p className="text-xs font-bold text-white">BMKG Stasiun Klimatologi</p>
              <p className="text-[11px] text-neutral-400 mt-1">
                Arah angin, tingkat kelembaban udara, dan indeks kekeringan lahan.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-800/80 border border-neutral-700/80">
              <p className="text-xs font-bold text-white">Komunitas Warga Lapangan</p>
              <p className="text-[11px] text-neutral-400 mt-1">
                Validasi visual geotagged dari masyarakat yang tinggal di tapak kejadian.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Bawah */}
        <section className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 text-center space-y-4 shadow-xs">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-lg sm:text-xl font-heading font-extrabold text-neutral-900">
              Mari Berpartisipasi Menjaga Wilayah Anda
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-normal">
              Deteksi dini menyelamatkan ribuan hektar vegetasi dan menjaga napas generasi mendatang.
              Gunakan FIREZONE saat melihat kebakaran lahan atau pantau titik panas di sekitar Anda.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/community/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-xs transition"
            >
              <Camera className="w-4 h-4" />
              <span>Lapor Temuan Titik Api</span>
            </Link>
            <Link
              to="/emergency"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs sm:text-sm transition"
            >
              <span>Kontak Siaga 24 Jam BPBD</span>
            </Link>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

