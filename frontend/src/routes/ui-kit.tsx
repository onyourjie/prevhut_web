import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Chip } from '@/components/ui/chip'
import { Badge, RiskBadge } from '@/components/ui/badge'
import { Toggle } from '@/components/ui/toggle'
import { ProgressBar, ProgressCircle } from '@/components/ui/progress'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { Card, MetricCard } from '@/components/ui/card'
import { AgencyBadge } from '@/components/ui/agency-badge'
import { SourceTimeLine } from '@/components/feedback/source-time-line'
import { Skeleton, SkeletonCard } from '@/components/feedback/skeleton'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { PageHeader } from '@/components/layout/page-header'
import { BottomNav } from '@/components/layout/bottom-nav'

export const Route = createFileRoute('/ui-kit')({
  component: UiKitShowcase,
})

function UiKitShowcase() {
  const [toggleVal1, setToggleVal1] = useState(true)
  const [toggleVal2, setToggleVal2] = useState(false)
  const [activeSegment, setActiveSegment] = useState<'all' | 'system' | 'community'>('all')
  const [activeChip, setActiveChip] = useState('24h')
  const [inputText, setInputText] = useState('')

  return (
    <div className="min-h-screen bg-white text-neutral-1000 pb-20">
      <PageHeader
        title="Firezone UI Kit"
        action={
          <Link
            to="/"
            className="text-xs font-bold text-brand-700 hover:text-brand-800 min-h-[44px] inline-flex items-center px-2 focus-ring"
          >
            ← Beranda
          </Link>
        }
      />

      <main className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-10">
        {/* Intro */}
        <section className="p-4 rounded-[var(--radius-md)] bg-neutral-25 border border-neutral-200 text-left">
          <h2 className="text-sm font-bold text-neutral-1000 mb-1">
            Panduan Komponen & Token Firezone
          </h2>
          <p className="text-xs text-neutral-700 leading-relaxed">
            Halaman ini mendemonstrasikan seluruh komponen UI dasar.
          </p>
        </section>

        {/* 1. Buttons */}
        <section className="flex flex-col gap-4 text-left">
          <div className="border-b border-neutral-200 pb-2">
            <h2 className="text-base font-bold text-neutral-1000">1. Button (Tombol)</h2>
            <p className="text-xs text-neutral-600">
              Varian Primary (brand-700), Secondary (accent-900), Danger (error-600), Outline.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="primary" size="md">
              Primary Action
            </Button>
            <Button variant="secondary" size="md">
              Secondary Posko
            </Button>
            <Button variant="danger" size="md">
              Tolak / Bahaya
            </Button>
            <Button variant="outline" size="md">
              Outline Brand
            </Button>
            <Button variant="primary" size="md" disabled>
              Disabled
            </Button>
            <Button variant="primary" size="md" isLoading>
              Loading
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 items-center pt-2">
            <Button variant="primary" size="sm">
              Ukuran Small
            </Button>
            <Button variant="primary" size="md">
              Ukuran Medium
            </Button>
            <Button variant="primary" size="lg">
              Ukuran Large
            </Button>
          </div>

          <div className="pt-2">
            <Button variant="primary" size="long">
              Button Long (Lebar Penuh Mobile)
            </Button>
          </div>
        </section>

        {/* 2. Inputs & Forms */}
        <section className="flex flex-col gap-4 text-left">
          <div className="border-b border-neutral-200 pb-2">
            <h2 className="text-base font-bold text-neutral-1000">2. Input Field & Textarea</h2>
            <p className="text-xs text-neutral-600">
              Border neutral-500 (3,03:1), placeholder neutral-700 (5,33:1).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nama Lengkap"
              placeholder="Contoh: Budi Santoso"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              hint="Masukkan nama sesuai identitas resmi"
            />

            <Input
              label="Nomor Telepon"
              prefixText="+62"
              placeholder="812-3456-7890"
              hint="Nomor yang aktif WhatsApp untuk koordinasi"
            />

            <Input
              label="Lokasi Patroli"
              leftIcon={<span aria-hidden="true">📍</span>}
              placeholder="Pilih atau cari kecamatan"
            />

            <Input
              label="Input dengan Error"
              defaultValue="Titik api palsu"
              error="Koordinat berada di luar wilayah Kalimantan Barat"
            />
          </div>

          <Textarea
            label="Deskripsi Kondisi Lapangan"
            placeholder="Jelaskan kondisi kepulan asap, arah angin, atau akses jalan..."
            hint="Maksimal 500 karakter"
          />

          <div className="p-4 rounded-[var(--radius-md)] border border-neutral-200 bg-white">
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
              Toggle Switch (Pengaturan)
            </h3>
            <Toggle
              label="Notifikasi Peringatan Otomatis"
              description="Kirim sinyal bahaya saat ada titik panas berjarak di bawah 5 km"
              checked={toggleVal1}
              onChange={setToggleVal1}
            />
            <hr className="my-2 border-neutral-100" />
            <Toggle
              label="Status Kesiapan Relawan"
              description="Tandai diri kamu siap menerima panggilan tugas pemadaman"
              checked={toggleVal2}
              onChange={setToggleVal2}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
              Segmented Control (Filter Notifikasi)
            </label>
            <SegmentedControl
              value={activeSegment}
              onChange={setActiveSegment}
              options={[
                { value: 'all', label: 'Semua' },
                { value: 'system', label: 'Sistem' },
                { value: 'community', label: 'Komunitas' },
              ]}
            />
          </div>
        </section>

        {/* 3. Chips & Badges */}
        <section className="flex flex-col gap-4 text-left">
          <div className="border-b border-neutral-200 pb-2">
            <h2 className="text-base font-bold text-neutral-1000">3. Chips & Badges</h2>
          </div>

          <div>
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
              Filter Chips
            </h3>
            <div className="flex flex-wrap gap-2">
              <Chip selected={activeChip === '24h'} onClick={() => setActiveChip('24h')}>
                24 Jam Terakhir
              </Chip>
              <Chip selected={activeChip === '48h'} onClick={() => setActiveChip('48h')}>
                48 Jam Terakhir
              </Chip>
              <Chip selected={activeChip === '7d'} onClick={() => setActiveChip('7d')}>
                7 Hari Terakhir
              </Chip>
              <Chip
                selected={activeChip === 'filter'}
                onClick={() => setActiveChip('filter')}
                leftIcon={<span aria-hidden="true">+</span>}
              >
                Tambah Wilayah
              </Chip>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
              Status Badges (Pill)
            </h3>
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="success">Valid • Selesai</Badge>
              <Badge variant="warning">Menunggu Verifikasi</Badge>
              <Badge variant="danger">Laporan Ditolak</Badge>
              <Badge variant="neutral">Draft Laporan</Badge>
              <Badge variant="accent">Posko Aktif</Badge>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
              Tingkat Risiko (DESIGN.md 3.5)
            </h3>
            <div className="flex flex-wrap gap-2 items-center">
              <RiskBadge level="high" />
              <RiskBadge level="medium" />
              <RiskBadge level="low" />
              <RiskBadge level="nodata" />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
              Badge Tim Darurat (DESIGN.md 6.9 & Panggilan)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AgencyBadge
                agency="police"
                name="Polsek Rasau Jaya"
                phoneNumber="0561-123456"
              />
              <AgencyBadge
                agency="fire"
                name="Pemadam Manggala Agni"
                phoneNumber="0561-654321"
              />
              <AgencyBadge
                agency="bpbd"
                name="BPBD Kubu Raya"
                phoneNumber="0561-998877"
              />
              <AgencyBadge
                agency="medical"
                name="Puskesmas Terdekat"
                phoneNumber="0561-112233"
              />
            </div>
          </div>
        </section>

        {/* 4. Progress & Metrik */}
        <section className="flex flex-col gap-4 text-left">
          <div className="border-b border-neutral-200 pb-2">
            <h2 className="text-base font-bold text-neutral-1000">4. Progress & Metrik</h2>
            <p className="text-xs text-neutral-600">
              Garis progres langkah atau unggahan foto dan kartu ringkasan cepat.
            </p>
          </div>

          <div className="p-4 rounded-[var(--radius-md)] border border-neutral-200 bg-white flex flex-col gap-4">
            <ProgressBar value={65} label="Unggah Bukti Lapangan" />
            <ProgressBar value={85} label="Skor Risiko Area (FRP Tinggi)" variant="danger" />
            <ProgressBar value={40} label="Verifikasi Laporan" variant="warning" />
          </div>

          <div className="flex items-center gap-6 p-4 rounded-[var(--radius-md)] border border-neutral-200 bg-white">
            <ProgressCircle value={78} label="Progres Padam" variant="brand" />
            <ProgressCircle value={92} label="Skor Bahaya" variant="danger" />
            <ProgressCircle value={45} label="Evakuasi" variant="accent" />
          </div>

          <div>
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
              Small Metric Cards (DESIGN.md 6.8b)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <MetricCard
                type="hotspot"
                title="Titik Panas"
                value="12"
                subtitle="24 jam terakhir"
                icon={<span aria-hidden="true">🔥</span>}
              />
              <MetricCard
                type="weather"
                title="Cuaca Pontianak"
                value="31°C"
                subtitle="Cerah berawan"
                icon={<span aria-hidden="true">☀️</span>}
              />
              <MetricCard
                type="posko"
                title="Posko Siaga"
                value="2,4 km"
                subtitle="Posko Terdekat"
                icon={<span aria-hidden="true">🏕️</span>}
              />
            </div>
          </div>
        </section>

        {/* 5. Cards & Motif Identitas */}
        <section className="flex flex-col gap-4 text-left">
          <div className="border-b border-neutral-200 pb-2">
            <h2 className="text-base font-bold text-neutral-1000">
              5. Kartu Informasi & Motif Identitas
            </h2>
            <p className="text-xs text-neutral-600">
              Setiap kartu data menyertakan baris sumber dan waktu pengamatan (minimal 12px font).
            </p>
          </div>

          {/* Large Card Warga */}
          <Card className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-700">Kondisi Wilayah Kamu</span>
              <RiskBadge level="high" />
            </div>
            <h3 className="text-base font-bold text-neutral-1000">
              Ada indikasi titik panas terdeteksi di sekitar Kubu Raya
            </h3>
            <p className="text-xs text-neutral-800 leading-relaxed">
              Suhu udara tercatat 31°C dengan kelembapan rendah. Terpantau 12 titik panas dalam
              radius 5 km dari lokasimu. Titik terdekat berjarak sekitar 2,4 km.
            </p>
            {/* Identity Motif */}
            <SourceTimeLine
              items={[
                { label: 'Titik Panas', sourceName: 'NASA FIRMS/VIIRS', observedTime: '01.30 WIB' },
                { label: 'Cuaca', sourceName: 'BMKG', observedTime: '10.30 WIB' },
              ]}
            />
          </Card>

          {/* Priority Card Relawan */}
          <Card variant="warning-tint" className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-2 py-0.5 rounded-[var(--radius-full)] bg-warning-600 text-neutral-1000 text-[11px] font-bold">
                PRIORITAS • RELAWAN
              </span>
              <span className="text-xs text-warning-900 font-semibold">1,8 km dari posko</span>
            </div>
            <h3 className="text-sm font-bold text-neutral-1000">
              Lahan Gambut Rasau Jaya III butuh pemantauan segera
            </h3>
            <p className="text-xs text-neutral-800 leading-relaxed">
              3 laporan warga terverifikasi. Potensi perambatan ke arah perkebunan masyarakat.
            </p>
            <div className="pt-2 flex justify-between items-center">
              <Button variant="primary" size="sm">
                Lihat di Peta
              </Button>
              <SourceTimeLine
                items={[
                  { sourceName: 'Laporan Warga & Sentinel-2', observedTime: '30 menit lalu' },
                ]}
              />
            </div>
          </Card>
        </section>

        {/* 6. Pola State (DESIGN.md 8.1) */}
        <section className="flex flex-col gap-4 text-left">
          <div className="border-b border-neutral-200 pb-2">
            <h2 className="text-base font-bold text-neutral-1000">
              6. Pola State (Memuat, Kosong, Error)
            </h2>
            <p className="text-xs text-neutral-600">
              Skeleton statis (MOTION 1), state kosong bersebab dan beraksi, serta error dengan retry.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
              Skeleton Statis (Tanpa Shimmer)
            </h3>
            <div className="flex flex-col gap-3 p-4 rounded-[var(--radius-md)] border border-neutral-200 bg-white mb-3">
              <Skeleton shape="text" className="w-1/2 h-5" />
              <Skeleton shape="text" className="w-full h-4" />
              <Skeleton shape="text" className="w-3/4 h-4" />
              <div className="flex gap-2 pt-2">
                <Skeleton shape="rect" className="w-24 h-8" />
                <Skeleton shape="rect" className="w-20 h-8" />
              </div>
            </div>
            <SkeletonCard />
          </div>

          <div>
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
              Empty State (Penyebab + Aksi)
            </h3>
            <EmptyState
              title="Belum Ada Laporan Titik Api"
              description="Tidak ada laporan aktif dari warga di sekitarmu saat ini. Laporkan segera bila kamu melihat tanda kebakaran."
              actionLabel="Buat Laporan Baru"
              onAction={() => alert('Aksi Buat Laporan ditekan')}
            />
          </div>

          <div>
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
              Error State (Dengan Tombol Coba Lagi)
            </h3>
            <ErrorState
              title="Data Satelit Gagal Dimuat"
              message="Koneksi ke layanan NASA FIRMS terputus sementara. Periksa koneksi internetmu."
              lastUpdated="10.30 WIB"
              onRetry={() => alert('Mencoba memuat ulang data...')}
            />
          </div>
        </section>
      </main>

      {/* Bottom Nav demonstration */}
      <BottomNav />
    </div>
  )
}
