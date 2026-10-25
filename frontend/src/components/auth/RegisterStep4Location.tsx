import React from 'react'
import { ChevronDown, Crosshair, Loader2, ArrowRight } from 'lucide-react'
import { KALIMANTAN_PROVINCES, type RegencyData } from '@/lib/kalimantan-locations'
import type { RegisterFormState } from './register.types'

interface RegisterStep4LocationProps {
  form: RegisterFormState
  availableRegencies: RegencyData[]
  availableDistricts: string[]
  agree: boolean
  loading: boolean
  detectingGps: boolean
  onProvinceChange: (province: string) => void
  onRegencyChange: (regency: string) => void
  onDistrictChange: (district: string) => void
  onAgreeChange: (agree: boolean) => void
  onDetectGps: () => void
  onSubmit: (e: React.FormEvent) => void
}

export function RegisterStep4Location({
  form,
  availableRegencies,
  availableDistricts,
  agree,
  loading,
  detectingGps,
  onProvinceChange,
  onRegencyChange,
  onDistrictChange,
  onAgreeChange,
  onDetectGps,
  onSubmit,
}: RegisterStep4LocationProps) {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-neutral-1000 tracking-tight">
          Di mana kamu tinggal?
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 mt-1">
          Domisili digunakan saat lokasi perangkat tidak ditemukan.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3.5">
        {/* Dropdown Provinsi */}
        <div>
          <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
            Provinsi (Pulau Kalimantan)
          </label>
          <div className="relative">
            <select
              value={form.province}
              onChange={(e) => onProvinceChange(e.target.value)}
              className="w-full appearance-none h-12 pl-4 pr-11 bg-white border border-neutral-300 rounded-xl text-sm font-medium text-neutral-900 shadow-xs transition-all duration-150 hover:border-neutral-400 focus:border-brand-600 focus:ring-4 focus:ring-brand-500/15 focus:outline-none cursor-pointer"
            >
              {KALIMANTAN_PROVINCES.map((prov) => (
                <option key={prov.name} value={prov.name}>
                  {prov.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center text-neutral-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Dropdown Kabupaten/Kota */}
        <div>
          <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
            Kabupaten / Kota
          </label>
          <div className="relative">
            <select
              value={form.kabupaten}
              onChange={(e) => onRegencyChange(e.target.value)}
              className="w-full appearance-none h-12 pl-4 pr-11 bg-white border border-neutral-300 rounded-xl text-sm font-medium text-neutral-900 shadow-xs transition-all duration-150 hover:border-neutral-400 focus:border-brand-600 focus:ring-4 focus:ring-brand-500/15 focus:outline-none cursor-pointer"
            >
              {availableRegencies.map((reg) => (
                <option key={reg.name} value={reg.name}>
                  {reg.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center text-neutral-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Dropdown Kecamatan */}
        <div>
          <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
            Kecamatan
          </label>
          <div className="relative">
            <select
              value={form.kecamatan}
              onChange={(e) => onDistrictChange(e.target.value)}
              className="w-full appearance-none h-12 pl-4 pr-11 bg-white border border-neutral-300 rounded-xl text-sm font-medium text-neutral-900 shadow-xs transition-all duration-150 hover:border-neutral-400 focus:border-brand-600 focus:ring-4 focus:ring-brand-500/15 focus:outline-none cursor-pointer"
            >
              {availableDistricts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center text-neutral-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Divider ATAU */}
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-neutral-200" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            ATAU
          </span>
          <div className="flex-1 h-px bg-neutral-200" />
        </div>

        {/* Tombol Gunakan Lokasi GPS Saat Ini */}
        <button
          type="button"
          onClick={onDetectGps}
          disabled={detectingGps}
          className="w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 border-accent-300 bg-accent-50/60 hover:bg-accent-50 text-left transition cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-accent-800 text-white flex items-center justify-center shrink-0">
            {detectingGps ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Crosshair className="w-4 h-4" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-xs text-neutral-900">
              Gunakan lokasi saya saat ini
            </h4>
            <p className="text-[11px] text-neutral-600">
              Isi koordinat secara otomatis berdasarkan sensor perangkat.
            </p>
          </div>
        </button>

        {/* Persetujuan Checkbox */}
        <label className="flex items-start gap-2.5 cursor-pointer pt-2">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => onAgreeChange(e.target.checked)}
            className="mt-0.5 rounded border-neutral-300 text-brand-700 focus:ring-brand-500 cursor-pointer"
          />
          <span className="text-[11px] text-neutral-600 leading-relaxed">
            Saya menyetujui Syarat & Ketentuan serta Kebijakan Privasi data kebencanaan se-Pulau Kalimantan.
          </span>
        </label>

        {/* Tombol Submit Final */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-3 bg-brand-700 hover:bg-brand-800 active:bg-brand-900 text-white font-bold py-3 rounded-xl transition shadow-md shadow-brand-700/25 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Mendaftarkan akun...</span>
            </>
          ) : (
            <>
              <span>Selesaikan Pendaftaran</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
