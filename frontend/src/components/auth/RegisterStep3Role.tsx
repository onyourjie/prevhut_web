import { Home, Shield, ShieldAlert, ArrowRight } from 'lucide-react'
import type { RegisterFormState } from './register.types'

interface RegisterStep3RoleProps {
  form: RegisterFormState
  onChange: (fields: Partial<RegisterFormState>) => void
  onNext: () => void
}

export function RegisterStep3Role({
  form,
  onChange,
  onNext,
}: RegisterStep3RoleProps) {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-neutral-1000 tracking-tight">
          Apa peran kamu?
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 mt-1">
          Kami akan menyesuaikan informasi dengan peran yang kamu pilih.
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {/* Card Warga */}
        <button
          type="button"
          onClick={() => onChange({ role: 'WARGA' })}
          className={`w-full flex items-start gap-3.5 p-4 rounded-2xl border-2 text-left transition cursor-pointer ${
            form.role === 'WARGA'
              ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-500/20'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              form.role === 'WARGA'
                ? 'bg-brand-700 text-white'
                : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-neutral-900">Warga</h3>
            <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
              Pantau kondisi sekitar dan berbagi informasi.
            </p>
          </div>
        </button>

        {/* Card Relawan */}
        <button
          type="button"
          onClick={() => onChange({ role: 'RELAWAN' })}
          className={`w-full flex items-start gap-3.5 p-4 rounded-2xl border-2 text-left transition cursor-pointer ${
            form.role === 'RELAWAN'
              ? 'border-accent-700 bg-accent-50/70 ring-2 ring-accent-600/20'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              form.role === 'RELAWAN'
                ? 'bg-accent-800 text-white'
                : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-neutral-900">Relawan</h3>
            <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
              Pantau kondisi sekitar dan terima pembaruan prioritas.
            </p>
          </div>
        </button>
      </div>

      {/* Otoritas Note */}
      <div className="mb-6 flex items-start gap-2.5 p-3 rounded-xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-600">
        <ShieldAlert className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
        <span>
          <strong>Akses Otoritas:</strong> Akun Admin Posko (BPBD) dikelola secara internal oleh instansi dan tidak dibuka untuk pendaftaran publik.
        </span>
      </div>

      {/* Tombol Selanjutnya */}
      <button
        type="button"
        onClick={onNext}
        className="w-full bg-brand-700 hover:bg-brand-800 active:bg-brand-900 text-white font-bold py-3 rounded-xl transition shadow-md shadow-brand-700/25 flex items-center justify-center gap-2 text-sm cursor-pointer"
      >
        <span>Selanjutnya</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}
