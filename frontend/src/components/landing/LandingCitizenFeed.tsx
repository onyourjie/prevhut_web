import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Camera,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlusCircle,
  Check,
} from 'lucide-react';
import {
  StaggerTextContainer,
  SplitText,
  BlurReveal,
  StaggerContainer,
  StaggerItem,
} from '@/components/ui/motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay } from 'swiper/modules';
import { apiRequest } from '@/lib/api';
import type { PostItem } from '@/components/community/post-card.types';
import { formatDateTimeIndo } from '@/lib/utils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';

interface DisplayCitizenReport {
  id: string;
  content: string;
  imageUrl?: string;
  category: string;
  status: string;
  address: string;
  createdAt: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
}

const FALLBACK_CITIZEN_REPORTS: DisplayCitizenReport[] = [
  {
    id: '1',
    content:
      'Asap pekat membubung tinggi di perbatasan kebun sawit dan parit gambut. Angin berhembus cukup kencang ke arah pemukiman warga RT 04.',
    imageUrl:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    category: 'DARURAT',
    status: 'TERVERIFIKASI_BPBD',
    address: 'Kec. Sintang, Kalimantan Barat',
    createdAt: new Date().toISOString(),
    authorName: 'Rahmat Santoso',
    authorRole: 'Warga & Relawan Desa',
    authorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop',
  },
  {
    id: '2',
    content:
      'Bara api di dalam tanah gambut kedalaman 1-2 meter masih mengeluarkan asap tebal. Regu MPA membutuhkan dukungan selang tambahan dan pompa jinjing.',
    imageUrl:
      'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=800&q=80',
    category: 'SIAGA_1',
    status: 'INVESTIGASI_LAPANGAN',
    address: 'Kab. Ketapang, Kalimantan Barat',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    authorName: 'Hendro Gunawan',
    authorRole: 'Masyarakat Peduli Api (MPA)',
    authorAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop',
  },
  {
    id: '3',
    content:
      'Penyekatan parit berhasil membatasi api menjalar ke hutan lindung. Anggota Manggala Agni dan warga bersama-sama melakukan pendinginan menyeluruh.',
    imageUrl:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    category: 'PENANGANAN',
    status: 'TERKENDALI',
    address: 'Kab. Pulang Pisau, Kalimantan Tengah',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    authorName: 'Budi Darmawan',
    authorRole: 'Koordinator Lapangan BPBD',
    authorAvatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop',
  },
  {
    id: '4',
    content:
      'Jarak pandang pagi ini menurun akibat kabut asap kiriman. Warga membagikan masker pelindung dan mengingatkan anak-anak untuk mengurangi aktivitas luar rumah.',
    imageUrl:
      'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=800&q=80',
    category: 'KABUT_ASAP',
    status: 'SIAGA_KESEHATAN',
    address: 'Palangka Raya, Kalimantan Tengah',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    authorName: 'Siti Nurhaliza',
    authorRole: 'Kader Posyandu & Relawan',
    authorAvatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&h=150&auto=format&fit=crop',
  },
];

export function LandingCitizenFeed() {
  const [reports, setReports] = useState<DisplayCitizenReport[]>(FALLBACK_CITIZEN_REPORTS);

  useEffect(() => {
    apiRequest<PostItem[]>('/community/posts')
      .then((data) => {
        if (data && data.length > 0) {
          const mapped: DisplayCitizenReport[] = data.slice(0, 5).map((p, idx) => ({
            id: p.id,
            content: p.content,
            imageUrl:
              p.imageUrl ||
              FALLBACK_CITIZEN_REPORTS[idx % FALLBACK_CITIZEN_REPORTS.length].imageUrl,
            category: p.category || 'LAPORAN_WARGA',
            status: p.status || 'TERVERIFIKASI',
            address: p.address || p.kabupaten || 'Kalimantan',
            createdAt: p.createdAt,
            authorName: p.author?.name || 'Warga Pelapor',
            authorRole: p.author?.role === 'ADMIN' ? 'Petugas BPBD' : 'Warga Terverifikasi',
            authorAvatar:
              p.author?.avatarUrl ||
              FALLBACK_CITIZEN_REPORTS[idx % FALLBACK_CITIZEN_REPORTS.length].authorAvatar,
          }));
          setReports(mapped);
        }
      })
      .catch((err) => {
        console.warn('Gagal mengambil laporan api, menggunakan data kurasi lapangan:', err);
      });
  }, []);

  const benefits = [
    'Foto Kamera Langsung Tanpa Akses Galeri (Bebas Foto Lawas)',
    'Koordinat Satelit GPS Terkunci Otomatis (Akurasi Tinggi)',
    'Terhubung Langsung ke WhatsApp Regu Pemadam & BPBD',
    'Catatan Arah Asap dan Karakteristik Lahan Gambut Sekitar',
  ];

  return (
    <section className="bg-white py-24 sm:py-32 lg:py-40 overflow-hidden border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Sisi Kiri: 3D Swiper Cards dengan Foto di Bagian Atas */}
          <div className="order-2 lg:order-1 relative w-full flex justify-center perspective-1000">
            <Swiper
              effect={'cards'}
              grabCursor={true}
              modules={[EffectCards, Autoplay]}
              autoplay={{
                delay: 4500,
                disableOnInteraction: false,
              }}
              speed={600}
              cardsEffect={{
                perSlideOffset: 14,
                perSlideRotate: 3,
                rotate: true,
                slideShadows: false,
              }}
              loop={reports.length > 2}
              className="w-full max-w-[340px] sm:max-w-[420px] md:max-w-[460px] !overflow-visible"
            >
              {[...reports, ...reports].map((item, idx) => (
                <SwiperSlide key={`${item.id}-${idx}`} className="!rounded-[28px] overflow-hidden">
                  <div className="bg-white rounded-[28px] border border-neutral-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col justify-between min-h-[500px] sm:min-h-[540px] h-full transition-transform duration-300 hover:-translate-y-1 relative">
                    {/* BAGIAN ATAS CARD: FOTO DOKUMENTASI LAPORAN */}
                    <div className="relative aspect-[16/10] sm:aspect-[16/9.5] w-full overflow-hidden bg-neutral-900">
                      <img
                        src={item.imageUrl}
                        alt="Dokumentasi Laporan Karhutla"
                        className="w-full h-full object-cover select-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                      {/* Badge Kamera Langsung */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-950/80 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white shadow-md">
                        <Camera className="w-3.5 h-3.5 text-orange-400" />
                        <span>Kamera Langsung GPS</span>
                      </div>

                      {/* Badge Status Kategori */}
                      <div
                        className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-md ${
                          item.category === 'DARURAT'
                            ? 'bg-red-600/90 text-white border border-red-400/30'
                            : 'bg-neutral-900/80 text-white border border-white/10'
                        }`}
                      >
                        {item.category.replace(/_/g, ' ')}
                      </div>

                      {/* Lokasi di bawah gambar */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                          <span className="truncate text-[11px] font-medium drop-shadow-sm">
                            {item.address}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-neutral-300 shrink-0">
                          <Clock className="w-3 h-3" />
                          <span>{formatDateTimeIndo(item.createdAt).split(' pukul')[0]}</span>
                        </div>
                      </div>
                    </div>

                    {/* BAGIAN TENGAH CARD: KUTIPAN KONDISI LAPANGAN */}
                    <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                      <div>
                        {/* Status Validasi BPBD Badge */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 mb-3">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                            {item.status.replace(/_/g, ' ')}
                          </span>
                        </div>

                        {/* Isi Laporan Warga */}
                        <blockquote className="text-sm sm:text-base font-heading font-medium text-neutral-800 leading-relaxed line-clamp-3">
                          "{item.content}"
                        </blockquote>
                      </div>

                      {/* BAGIAN BAWAH CARD: IDENTITAS WARGA PELAPOR */}
                      <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 mt-4">
                        <div className="relative">
                          <img
                            src={item.authorAvatar}
                            alt={item.authorName}
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shrink-0 grayscale contrast-125 opacity-90 border border-neutral-200"
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5">
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
                          </div>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <p className="text-sm font-bold text-neutral-900 truncate">
                            {item.authorName}
                          </p>
                          <p className="text-xs text-neutral-500 truncate">{item.authorRole}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Sisi Kanan: Tipografi & Penjelasan Editorial dengan Animasi Halus */}
          <div className="flex flex-col justify-center order-1 lg:order-2 lg:pl-6 text-left">
            <BlurReveal delay={0.05}>
              <p className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-3">
                Bukti Otentik Garis Depan
              </p>
            </BlurReveal>

            <StaggerTextContainer
              delayChildren={0.1}
              staggerChildren={0.04}
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-neutral-900 leading-[1.15] tracking-tight mb-6"
            >
              <span>
                <SplitText text="Disaksikan & Divalidasi oleh" />
              </span>{' '}
              <br />
              <span className="text-orange-600">
                <SplitText text="Komunitas di Lapangan." />
              </span>
            </StaggerTextContainer>

            <BlurReveal delay={0.25}>
              <p className="text-base sm:text-lg text-neutral-600 leading-relaxed mb-8 font-normal">
                Data anomali termal satelit luar angkasa diverifikasi oleh mata dan kamera warga di darat.
                Setiap laporan warga wajib diambil secara langsung tanpa akses galeri foto arsip, menjamin
                regu Manggala Agni dan BPBD hanya bergerak menuju titik api yang nyata.
              </p>
            </BlurReveal>

            {/* Checklist 4 Pilar Kepercayaan dengan Stagger Animation */}
            <StaggerContainer delayChildren={0.35} staggerChildren={0.08} className="flex flex-col gap-3.5 mb-10">
              {benefits.map((benefit, i) => (
                <StaggerItem key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-neutral-800">{benefit}</span>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Tombol Aksi dengan BlurReveal */}
            <BlurReveal delay={0.5}>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/community"
                  className="rounded-xl font-bold bg-neutral-900 text-white hover:bg-neutral-800 px-6 py-3.5 text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-neutral-900/10 transition-all duration-200 active:scale-95"
                >
                  <span>Buka Kabar Warga & Komunitas</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/community/create"
                  className="rounded-xl font-bold bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 px-5 py-3.5 text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 active:scale-95"
                >
                  <PlusCircle className="w-4 h-4 text-orange-600" />
                  <span>Lapor Titik Api Baru</span>
                </Link>
              </div>
            </BlurReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
