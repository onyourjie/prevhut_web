import { X } from 'lucide-react'

interface EvacuationGuideModalProps {
  isOpen: boolean
  onClose: () => void
}

const EVACUATION_STEPS = [
  {
    step: 1,
    title: 'Amankan saluran pernapasan',
    desc: 'Pakai masker (N95 jika ada) atau tutup hidung & mulut dengan kain basah berlapis ganda untuk menyaring partikel berbahaya PM2.5.',
  },
  {
    step: 2,
    title: 'Kenali arah angin & asap',
    desc: 'Perhatikan hembusan angin. Jangan pernah bergerak searah jalur asap atau semak belukar yang belum terbakar.',
  },
  {
    step: 3,
    title: 'Bawa tas siaga bencana',
    desc: 'Bawa surat berharga, obat pribadi, senter, air minum bersih, serta identitas pengenal dalam tas punggung yang mudah dibawa berlari.',
  },
  {
    step: 4,
    title: 'Ikuti jalur evakuasi',
    desc: 'Segera menuju posko evakuasi terdekat yang telah ditentukan BPBD, hindari melintasi semak gambut yang berpotensi memiliki api bawah tanah.',
  },
  {
    step: 5,
    title: 'Tunggu hingga ada info resmi',
    desc: 'Tetap berada di titik kumpul aman hingga ada instruksi resmi dari petugas pemadam kebakaran atau tim posko.',
  },
]

export function EvacuationGuideModal({ isOpen, onClose }: EvacuationGuideModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-4 my-8">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h3 className="font-black text-base text-neutral-900">
              Panduan & Protokol Evakuasi Cepat
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Tetap tenang, perhatikan arah angin, dan ikuti langkah darurat berikut:
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 pt-1">
          {EVACUATION_STEPS.map((s) => (
            <div
              key={s.step}
              className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-3"
            >
              <div className="w-7 h-7 rounded-full bg-brand-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                {s.step}
              </div>
              <div>
                <h5 className="font-extrabold text-xs text-neutral-900">
                  {s.title}
                </h5>
                <p className="text-[11px] text-neutral-600 leading-relaxed mt-0.5">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs transition cursor-pointer"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  )
}
