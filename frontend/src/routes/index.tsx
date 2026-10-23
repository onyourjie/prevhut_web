import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BottomNav } from '@/components/layout/bottom-nav'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen bg-white text-neutral-1000 flex flex-col pb-20">
      <header className="border-b border-neutral-200 px-4 py-3 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">
            🔥
          </span>
          <h1 className="text-base font-bold text-neutral-1000">Firezone</h1>
        </div>
        <Link
          to="/ui-kit"
          className="text-xs font-bold text-brand-700 hover:text-brand-800 min-h-[44px] inline-flex items-center px-2 focus-ring"
        >
          Lihat UI Kit →
        </Link>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-8 flex flex-col gap-6 text-left">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
            Sistem Peringatan Dini Karhutla
          </span>
          <h2 className="text-xl font-bold text-neutral-1000">
            Informasi Titik Panas & Tanggap Kebakaran Kalimantan
          </h2>
          <p className="text-sm text-neutral-700 leading-relaxed">
            Platform web tanggap bencana berbasis mobile-first untuk memantau titik panas satelit,
            laporan warga, dan koordinasi relawan lapangan.
          </p>
        </div>

        <Card className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-neutral-1000">Etalase Komponen UI Kit</h3>
          <p className="text-xs text-neutral-700 leading-relaxed">
            Seluruh komponen tombol, input, badge status, kartu metrik, baris sumber data, dan
            pola state siap ditinjau di rute khusus.
          </p>
          <Link to="/ui-kit" className="w-full">
            <Button variant="primary" size="long">
              Buka Halaman UI Kit
            </Button>
          </Link>
        </Card>
      </main>

      <BottomNav />
    </div>
  )
}
