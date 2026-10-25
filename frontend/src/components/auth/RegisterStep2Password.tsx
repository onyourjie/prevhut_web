import React, { useState } from 'react'
import { Lock, Eye, EyeOff, Check, X, ArrowRight } from 'lucide-react'
import { PASSWORD_RULES, type RegisterFormState } from './register.types'

interface RegisterStep2PasswordProps {
  form: RegisterFormState
  onChange: (fields: Partial<RegisterFormState>) => void
  onSubmit: (e: React.FormEvent) => void
}

export function RegisterStep2Password({
  form,
  onChange,
  onSubmit,
}: RegisterStep2PasswordProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-neutral-1000 tracking-tight">
          Buat kata sandi
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 mt-1">
          Gunakan kata sandi ini untuk masuk ke akun FIREZONE.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Kata Sandi */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Kata sandi
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukkan kata sandi"
              value={form.password}
              onChange={(e) => onChange({ password: e.target.value })}
              required
              className="w-full pl-10 pr-11 py-2.5 border border-neutral-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Kriteria Sandi */}
          {form.password && (
            <div className="mt-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <p className="text-[11px] font-semibold text-neutral-600 mb-1.5">
                Kriteria Keamanan Kata Sandi:
              </p>
              <ul className="grid grid-cols-1 gap-1.5">
                {PASSWORD_RULES.map((rule) => {
                  const ok = rule.test(form.password)
                  return (
                    <li
                      key={rule.label}
                      className={`text-[11px] flex items-center gap-1.5 ${
                        ok ? 'text-emerald-700 font-semibold' : 'text-neutral-500'
                      }`}
                    >
                      {ok ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      )}
                      <span>{rule.label}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Konfirmasi Kata Sandi */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Konfirmasi kata sandi
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Ulangi kata sandi"
              value={form.confirmPassword}
              onChange={(e) => onChange({ confirmPassword: e.target.value })}
              required
              className="w-full pl-10 pr-11 py-2.5 border border-neutral-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600 transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {form.confirmPassword && form.password !== form.confirmPassword && (
            <p className="text-[11px] text-red-600 mt-1">Kata sandi belum cocok</p>
          )}
        </div>

        {/* Tombol Selanjutnya */}
        <button
          type="submit"
          className="w-full mt-4 bg-brand-700 hover:bg-brand-800 active:bg-brand-900 text-white font-bold py-3 rounded-xl transition shadow-md shadow-brand-700/25 flex items-center justify-center gap-2 text-sm cursor-pointer"
        >
          <span>Selanjutnya</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
