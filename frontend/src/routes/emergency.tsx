import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import {
  Phone,
  MapPin,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
  Wind,
  Flame,
  Radio,
  FileText,
  HeartPulse,
  Flashlight,
  Droplets,
  Navigation,
  Info,
  Compass,
  Truck,
  Ambulance,
  LifeBuoy,
  Siren,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { apiRequest } from '@/lib/api';

export const Route = createFileRoute('/emergency')({
  component: EmergencyPage,
});

interface EmergencyContact {
  id?: string;
  name: string;
  number: string;
  category: string;
  badgeColor?: string;
}

interface GoBagItem {
  id: string;
  name: string;
  detail: string;
  icon: typeof FileText;
}

const GOBAG_ITEMS: GoBagItem[] = [
  {
    id: 'dokumen',
    name: 'Dokumen & Surat Tanah',
    detail: 'KTP, KK, sertifikat tanah dalam kantong plastik ziplock kedap air.',
    icon: FileText,
  },
  {
    id: 'medis',
    name: 'Obat Rutin & Masker N95',
    detail: 'Inhaler asma, tetes mata iritasi asap, dan stok respirator cadangan.',
    icon: HeartPulse,
  },
  {
    id: 'senter',
    name: 'Senter & Power Bank',
    detail: 'Penerangan kabut pekat (jarak pandang < 5m) dan baterai ponsel penuh.',
    icon: Flashlight,
  },
  {
    id: 'air',
    name: 'Air Bersih & Makanan',
    detail: 'Minimal 1.5 liter per orang untuk mencegah dehidrasi debu panas gambut.',
    icon: Droplets,
  },
];

export function EmergencyPage() {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'compass' | 'smoke' | 'checklist'>('compass');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    dokumen: true,
    medis: true,
    senter: false,
    air: false,
  });

  const { data: contacts = [], isLoading: isLoadingContacts } = useQuery<EmergencyContact[]>({
    queryKey: ['emergency-contacts'],
    queryFn: () => apiRequest<EmergencyContact[]>('/emergency/contacts'),
  });

  const handleCopy = (number: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(number);
    setCopiedNumber(number);
    setTimeout(() => {
      setCopiedNumber(null);
    }, 2000);
  };

  const toggleCheckItem = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const preparednessPercent = Math.round((checkedCount / GOBAG_ITEMS.length) * 100);

  const primaryDamkar = contacts.find((c) => c.number === '113') || {
    name: 'Pemadam Kebakaran',
    number: '113',
    category: 'Manggala Agni & Damkar Daerah',
  };
  const primaryMedis = contacts.find((c) => c.number === '119') || {
    name: 'Ambulans & Pertolongan Medis',
    number: '119',
    category: 'Dinas Kesehatan & RSUD',
  };
  const secondaryContacts = contacts.filter(
    (c) => c.number !== '113' && c.number !== '119',
  );

  return (
    <AppLayout
      title="Posko Darurat & Evakuasi"
      subtitle="Speed-dial instansi siaga dan panduan aksi keselamatan lapangan"
    >
      <div className="max-w-6xl mx-auto space-y-8 text-left pb-24">

        {/* 1. SITUATIONAL COMMAND DECK HEADER WITH LIVE ISPU GAUGE */}
        <section className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-2">
              <div className="flex items-center gap-2 text-neutral-400 text-xs">
                <Radio className="w-4 h-4 text-orange-500 animate-pulse" />
                <span>Saluran Panggilan Bebas Pulsa 24 Jam Seluruh Operator</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white leading-tight">
                Pusat Tanggap Darurat Karhutla Kalimantan
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl">
                Bila api mendekati permukiman atau kabut asap mencapai ambang pekat, gunakan speed-dial instansi kendaraan darurat di bawah. Selalu periksa arah angin sebelum melakukan evakuasi mandiri.
              </p>
            </div>

            {/* Visual ISPU (Air Quality) Meter Widget */}
            <div className="lg:col-span-4 bg-neutral-950/80 rounded-2xl p-4 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-300">Indeks Kualitas Udara (ISPU)</span>
                <span className="font-mono text-orange-400 font-bold">PM2.5: Waspada</span>
              </div>

              {/* Segmented Color Spectrum Bar */}
              <div className="space-y-1">
                <div className="h-3 w-full rounded-full bg-neutral-800 overflow-hidden flex gap-1 p-0.5">
                  <div className="h-full w-1/4 rounded-full bg-emerald-500" title="Baik" />
                  <div className="h-full w-1/4 rounded-full bg-amber-400" title="Sedang" />
                  <div className="h-full w-1/4 rounded-full bg-orange-500 ring-2 ring-white" title="Tidak Sehat" />
                  <div className="h-full w-1/4 rounded-full bg-red-600 opacity-40" title="Berbahaya" />
                </div>
                <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                  <span>Baik</span>
                  <span className="text-orange-300 font-bold">Tidak Sehat</span>
                  <span>Kritis</span>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-800/80">
                <span>Rekomendasi:</span>
                <span className="text-white font-medium">Gunakan Masker N95 di Luar</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. MAIN ASYMMETRIC WORKSPACE (7 : 5 Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN (7 COLS): TACTILE VEHICLE & SERVICE SPEED-DIAL */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <h3 className="font-heading font-bold text-base text-neutral-900">
                  Speed-Dial Instansi Garis Depan
                </h3>
                <p className="text-xs text-neutral-500">
                  Panggil langsung dari ponsel tanpa pulsa.
                </p>
              </div>
              <Link
                to="/map"
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Lihat Radar Api</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoadingContacts ? (
              <div className="p-12 text-center text-xs text-neutral-400 bg-white rounded-2xl border border-neutral-200 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-orange-600" />
                <span>Memuat data siaga posko...</span>
              </div>
            ) : (
              <div className="space-y-4">

                {/* PRIMARY 1: DAMKAR (TRUCK ICON) */}
                <div className="bg-white rounded-2xl border-2 border-red-200 p-5 sm:p-6 shadow-xs relative overflow-hidden transition hover:border-red-300">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                    <div className="flex items-start gap-4">
                      {/* Vehicle Icon Container: Fire Truck */}
                      <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0 shadow-2xs">
                        <Truck className="w-7 h-7" />
                      </div>

                      <div className="space-y-1.5">
                        <div>
                          <h4 className="font-heading font-bold text-base sm:text-lg text-neutral-900 leading-snug">
                            {primaryDamkar.name} & Manggala Agni
                          </h4>
                          <span className="text-xs font-semibold text-red-700 block">
                            Nomor Panggil 113 • Armada Pemadam & Pompa Gambut
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 leading-relaxed max-w-md">
                          Hubungi saat kobaran api menjalar ke kebun sawit, perimeter pemukiman, atau saat parit gambut mengeluarkan asap tebal membakar.
                        </p>

                        {/* Caller Prompt Helper Cheatsheet */}
                        <div className="mt-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] text-neutral-600 space-y-1">
                          <span className="font-bold text-neutral-800 block">Hal yang perlu disebutkan ke operator:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-neutral-700">
                            <span>1. Nama Desa / RT / Kecamatan</span>
                            <span>2. Patokan parit atau jalan terdekat</span>
                            <span>3. Arah menjalarnya kepulan asap</span>
                            <span>4. Adakah rumah yang terancam</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0">
                      <a
                        href={`tel:${primaryDamkar.number}`}
                        className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Panggil 113</span>
                      </a>
                      <button
                        type="button"
                        onClick={(e) => handleCopy('113', e)}
                        className="px-3 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                        title="Salin nomor"
                      >
                        {copiedNumber === '113' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Disalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-neutral-400" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* PRIMARY 2: MEDIS (AMBULANCE ICON) */}
                <div className="bg-white rounded-2xl border-2 border-emerald-200 p-5 sm:p-6 shadow-xs relative overflow-hidden transition hover:border-emerald-300">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                    <div className="flex items-start gap-4">
                      {/* Vehicle Icon Container: Ambulance */}
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs">
                        <Ambulance className="w-7 h-7" />
                      </div>

                      <div className="space-y-1.5">
                        <div>
                          <h4 className="font-heading font-bold text-base sm:text-lg text-neutral-900 leading-snug">
                            {primaryMedis.name}
                          </h4>
                          <span className="text-xs font-semibold text-emerald-800 block">
                            Nomor Panggil 119 • Ambulans & Tabung Oksigen Darurat
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 leading-relaxed max-w-md">
                          Hubungi bila ada anak-anak, lansia, atau warga yang lemas, napas berbunyi mengi, mengalami sesak napas akut (ISPA), atau butuh rujukan faskes.
                        </p>

                        {/* Caller Prompt Helper Cheatsheet */}
                        <div className="mt-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] text-neutral-600 space-y-1">
                          <span className="font-bold text-neutral-800 block">Hal yang perlu disebutkan ke operator:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-neutral-700">
                            <span>1. Kondisi kesadaran korban</span>
                            <span>2. Gejala bibir membiru / sesak napas</span>
                            <span>3. Alamat penjemputan ambulans</span>
                            <span>4. Ketersediaan akses roda empat</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0">
                      <a
                        href={`tel:${primaryMedis.number}`}
                        className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Panggil 119</span>
                      </a>
                      <button
                        type="button"
                        onClick={(e) => handleCopy('119', e)}
                        className="px-3 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                        title="Salin nomor"
                      >
                        {copiedNumber === '119' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Disalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-neutral-400" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* SECONDARY ROW: BASARNAS (LIFEBUOY) & POLISI (SIREN) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {secondaryContacts.map((contact) => {
                    const isSar = contact.number === '115';
                    const IconComp = isSar ? LifeBuoy : Siren;
                    const iconColor = isSar ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-blue-700 bg-blue-50 border-blue-200';
                    const numColor = isSar ? 'text-amber-700' : 'text-blue-700';
                    const desc = isSar
                      ? 'Evakuasi warga terisolasi kepungan api, korban terjebak di pondok kebun, atau penyelamatan jalur tertutup.'
                      : 'Penyekatan akses jalan yang tertutup asap tebal dan penertiban pembakaran lahan ilegal.';

                    return (
                      <div
                        key={contact.number}
                        className="bg-white rounded-2xl border border-neutral-300 p-4 sm:p-5 flex flex-col justify-between transition hover:border-neutral-400 shadow-2xs"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs ${iconColor}`}>
                                <IconComp className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-neutral-900">
                                  {contact.name}
                                </h4>
                                <span className={`text-xs font-semibold block ${numColor}`}>
                                  Nomor {contact.number}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleCopy(contact.number, e)}
                              className="text-neutral-400 hover:text-neutral-700 p-1.5 transition cursor-pointer"
                              title="Salin nomor"
                            >
                              {copiedNumber === contact.number ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>

                          <p className="text-xs text-neutral-600 leading-relaxed">
                            {desc}
                          </p>
                        </div>

                        <div className="pt-4 mt-3 border-t border-neutral-100">
                          <a
                            href={`tel:${contact.number}`}
                            className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Panggil {contact.number}</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}
          </div>

          {/* RIGHT COLUMN (5 COLS): VISUAL COMPASS DIAGRAM & INTERACTIVE ACTIONS */}
          <div className="lg:col-span-5 space-y-6">

            {/* TAB SELECTOR: Clean underline style */}
            <div className="bg-white rounded-3xl border border-neutral-300 p-6 shadow-xs space-y-5">
              <div className="border-b border-neutral-200">
                <div className="flex gap-4 -mb-px text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('compass')}
                    className={`pb-3 transition border-b-2 cursor-pointer ${
                      activeTab === 'compass'
                        ? 'border-neutral-900 text-neutral-900'
                        : 'border-transparent text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    Diagram Arah Angin
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('smoke')}
                    className={`pb-3 transition border-b-2 cursor-pointer ${
                      activeTab === 'smoke'
                        ? 'border-neutral-900 text-neutral-900'
                        : 'border-transparent text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    Ruang Bersih (Clean Room)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('checklist')}
                    className={`pb-3 transition border-b-2 cursor-pointer ${
                      activeTab === 'checklist'
                        ? 'border-neutral-900 text-neutral-900'
                        : 'border-transparent text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    Kesiapan Tas Siaga
                  </button>
                </div>
              </div>

              {/* TAB 1: VISUAL EVACUATION COMPASS & WIND DIAGRAM */}
              {activeTab === 'compass' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-sm text-neutral-900">
                      Aturan Emas: Evakuasi Tegak Lurus Arah Angin
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Jangan pernah berlari searah kepulan asap atau hembusan angin. Api gambut merambat sangat cepat mengikuti suplai oksigen.
                    </p>
                  </div>

                  {/* Visual Tactical Compass Graphic Box */}
                  <div className="bg-neutral-900 text-white rounded-2xl p-5 border border-neutral-800 relative overflow-hidden flex flex-col items-center justify-center text-center">
                    {/* Compass North Marker */}
                    <div className="text-[10px] font-mono text-neutral-400 mb-2 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-neutral-400" />
                      <span>UTARA (JALUR AMAN 90°)</span>
                    </div>

                    {/* Interactive Visual Graphic Grid */}
                    <div className="w-full max-w-xs py-3 relative flex items-center justify-between">
                      {/* West: Smoke Origin */}
                      <div className="flex flex-col items-center gap-1 z-10">
                        <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-700 flex items-center justify-center text-red-400">
                          <Flame className="w-6 h-6 animate-pulse" />
                        </div>
                        <span className="text-[10px] font-bold text-red-400">TITIK API</span>
                      </div>

                      {/* Center: Wind Vector Arrow */}
                      <div className="flex-1 px-3 flex flex-col items-center">
                        <div className="w-full flex items-center justify-center relative">
                          <div className="h-0.5 w-full bg-gradient-to-r from-red-500 via-amber-400 to-amber-200" />
                          <Wind className="w-5 h-5 text-amber-300 absolute -top-2.5 animate-bounce" />
                        </div>
                        <span className="text-[9px] font-mono text-amber-300 mt-2">HEMBUSAN ANGIN</span>
                      </div>

                      {/* East: Dangerous Smoke Path */}
                      <div className="flex flex-col items-center gap-1 z-10">
                        <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400">
                          <Wind className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold text-neutral-400">JALUR ASAP (BAHAYA)</span>
                      </div>
                    </div>

                    {/* Safe Exit Vector Labels */}
                    <div className="w-full pt-3 mt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1 text-emerald-400 font-bold">
                        <Navigation className="w-3.5 h-3.5 -rotate-45" />
                        <span>Evakuasi ke Kiri (Utara)</span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-400 font-bold">
                        <span>Evakuasi ke Kanan (Selatan)</span>
                        <Navigation className="w-3.5 h-3.5 rotate-45" />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700 space-y-1">
                    <strong className="block text-neutral-900">Peringatan Parit Gambut:</strong>
                    <p className="text-[11px] leading-relaxed text-neutral-600">
                      Bara gambut membakar di bawah permukaan tanah sedalam 2 sampai 4 meter. Jangan pernah menyeberangi semak atau tanggul parit yang mengeluarkan asap dari celah akar pohon.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: CLEAN ROOM SETUP PROTOCOL */}
              {activeTab === 'smoke' && (
                <div className="space-y-4 text-xs text-neutral-700 leading-relaxed">
                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-sm text-neutral-900">
                      Protokol Kamar Bersih (Clean Room Mandiri)
                    </h4>
                    <p className="text-neutral-600">
                      Bila kabut asap pekat mengepung rumah dan belum ada instruksi evakuasi terbuka:
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                      <span className="font-bold text-neutral-900 block">1. Pilih Ruangan Tengah</span>
                      <p className="text-neutral-600 text-[11px]">
                        Pilih satu kamar di bagian dalam rumah yang memiliki ventilasi atau jendela paling sedikit.
                      </p>
                    </div>

                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                      <span className="font-bold text-neutral-900 block">2. Basahi Handuk untuk Celah Pintu</span>
                      <p className="text-neutral-600 text-[11px]">
                        Gulung handuk basah yang sudah diperas dan sumpal celah di bawah pintu serta ventilasi kayu.
                      </p>
                    </div>

                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                      <span className="font-bold text-neutral-900 block">3. Batasi Aktivitas Fisik Berat</span>
                      <p className="text-neutral-600 text-[11px]">
                        Kurangi bernapas terengah-engah di dalam ruangan. Prioritaskan ruang ini untuk bayi, balita, dan lansia.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: INTERACTIVE CHECKLIST */}
              {activeTab === 'checklist' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-bold text-sm text-neutral-900">
                        Checklist Mandiri Tas Siaga
                      </h4>
                      <span className="font-mono text-xs font-bold text-emerald-700">
                        {preparednessPercent}% Siap
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 transition-all duration-300"
                        style={{ width: `${preparednessPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {GOBAG_ITEMS.map((item) => {
                      const isChecked = !!checkedItems[item.id];
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleCheckItem(item.id)}
                          className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-50/50 border-emerald-300 text-neutral-900'
                              : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition ${
                              isChecked
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-neutral-300 bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div className="space-y-0.5">
                            <span className="font-bold text-xs block text-neutral-900">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-neutral-500 block leading-tight">
                              {item.detail}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>



            {/* 4 PERLENGKAPAN WAJIB TAS SIAGA (Mengisi slot sisi kanan) */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-5 sm:p-6 space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-sm text-neutral-900">
                    4 Perlengkapan Wajib Tas Siaga
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Siapkan dalam satu ransel kedap air dekat pintu utama rumah.
                  </p>
                </div>
                <Info className="w-4 h-4 text-neutral-400 shrink-0" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {GOBAG_ITEMS.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="bg-white p-3.5 rounded-2xl border border-neutral-200 space-y-1.5 hover:border-neutral-300 transition shadow-2xs"
                    >
                      <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-neutral-900 text-xs block">
                        {item.name}
                      </span>
                      <p className="text-[11px] text-neutral-600 leading-snug">
                        {item.detail}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </AppLayout>
  );
}