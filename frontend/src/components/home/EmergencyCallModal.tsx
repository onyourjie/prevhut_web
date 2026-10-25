import { X, Phone } from 'lucide-react'

interface EmergencyCallModalProps {
  isOpen: boolean
  onClose: () => void
}

const EMERGENCY_CONTACTS = [
  { name: 'Pemadam Kebakaran', number: '113', color: '#dc2626' },
  { name: 'Tim SAR & Evakuasi', number: '115', color: '#ea580c' },
  { name: 'Kepolisian', number: '110', color: '#2563eb' },
  { name: 'Ambulans & Medis', number: '119', color: '#059669' },
]

export function EmergencyCallModal({ isOpen, onClose }: EmergencyCallModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h3 className="font-black text-base text-neutral-900">
              Panggilan Darurat
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Telepon pihak terkait untuk segera mendapatkan pertolongan:
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

        <div className="space-y-2.5">
          {EMERGENCY_CONTACTS.map((c) => (
            <a
              key={c.number}
              href={`tel:${c.number}`}
              className="p-3.5 rounded-2xl border border-neutral-200 hover:border-red-400 hover:shadow-xs flex items-center justify-between transition group bg-white"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl text-white font-black text-xs flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: c.color }}
                >
                  {c.number}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-neutral-900 group-hover:text-red-700 transition">
                    {c.name}
                  </h4>
                  <p className="text-[10px] text-neutral-400">Panggilan Bebas Pulsa</p>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-neutral-100 group-hover:bg-red-50 text-neutral-700 group-hover:text-red-700 text-xs font-bold transition flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>Panggil</span>
              </div>
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs transition cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  )
}
