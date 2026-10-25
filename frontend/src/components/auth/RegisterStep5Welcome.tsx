import { ArrowRight } from 'lucide-react'

interface RegisterStep5WelcomeProps {
  name: string
  kabupaten: string
  onComplete: () => void
}

export function RegisterStep5Welcome({
  name,
  kabupaten,
  onComplete,
}: RegisterStep5WelcomeProps) {
  return (
    <div className="text-center py-6 sm:py-8">
      <span className="inline-block px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wider uppercase mb-5">
        Akun Berhasil Dibuat
      </span>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-1000 tracking-tight mb-2">
        Selamat datang, {name.split(' ')[0]}!
      </h2>

      <p className="text-sm text-neutral-600 max-w-xs mx-auto leading-relaxed mb-8">
        Mulai pantau sekitar dan terhubung dengan komunitas di {kabupaten || 'Kalimantan'}, yuk!
      </p>

      <div>
        <button
          type="button"
          onClick={onComplete}
          className="w-full bg-brand-700 hover:bg-brand-800 active:bg-brand-900 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-brand-700/30 flex items-center justify-center gap-2 text-sm cursor-pointer"
        >
          <span>Buka Beranda</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
