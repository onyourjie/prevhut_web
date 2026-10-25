import React from 'react'
import { Link } from '@tanstack/react-router'
import { User, AtSign, Phone, Mail, ArrowRight } from 'lucide-react'
import type { RegisterFormState } from './register.types'

interface RegisterStep1PersonalProps {
  form: RegisterFormState
  onChange: (fields: Partial<RegisterFormState>) => void
  onSubmit: (e: React.FormEvent) => void
}

export function RegisterStep1Personal({
  form,
  onChange,
  onSubmit,
}: RegisterStep1PersonalProps) {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-neutral-1000 tracking-tight">
          Kenalan dulu, yuk!
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 mt-1">
          Isi data dirimu untuk mulai menggunakan FIREZONE.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3.5">
        {/* Nama Lengkap */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Nama
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Masukkan nama kamu"
              value={form.name}
              onChange={(e) => onChange({ name: e.target.value })}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600 transition"
            />
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Username
          </label>
          <div className="relative">
            <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Contoh: sarahwijiyatno"
              value={form.username}
              onChange={(e) =>
                onChange({
                  username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''),
                })
              }
              required
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600 transition font-mono"
            />
          </div>
        </div>

        {/* Nomor Telepon */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Nomor Telepon
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="tel"
              placeholder="081234567890 atau +62 812-3456-7890"
              value={form.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600 transition"
            />
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">
            Bisa diawali 08 atau +62 (10-13 digit nomor seluler)
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="email"
              placeholder="nama@email.com"
              value={form.email}
              onChange={(e) => onChange({ email: e.target.value })}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600 transition"
            />
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">
            Gunakan email aktif (Gmail, Yahoo, instansi .go.id, dll)
          </p>
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

      <p className="text-center text-xs text-neutral-500 mt-5">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-brand-700 hover:text-brand-800 font-bold hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  )
}
