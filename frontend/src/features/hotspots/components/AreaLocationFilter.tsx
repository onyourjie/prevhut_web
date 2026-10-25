import { MapPin, Navigation, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { KALIMANTAN_PROVINCES, type RegencyData } from '@/lib/kalimantan-locations'

interface AreaLocationFilterProps {
  selectedProvince: string | null
  selectedRegency: string | null
  selectedDistrict: string | null
  userRegency?: string
  availableRegencies: RegencyData[]
  availableDistricts: string[]
  onProvinceChange: (prov: string) => void
  onRegencyChange: (reg: string) => void
  onDistrictChange: (dist: string | null) => void
  onSetToUserLocation: () => void
}

export function AreaLocationFilter({
  selectedProvince,
  selectedRegency,
  selectedDistrict,
  userRegency,
  availableRegencies,
  availableDistricts,
  onProvinceChange,
  onRegencyChange,
  onDistrictChange,
  onSetToUserLocation,
}: AreaLocationFilterProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
          <MapPin className="w-4 h-4" />
          <span>Cakupan Wilayah</span>
        </div>

        {userRegency && (
          <button
            type="button"
            onClick={onSetToUserLocation}
            className="text-[11px] font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1 cursor-pointer bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200 hover:bg-brand-100 transition"
            title={`Atur filter ke lokasi Anda: ${userRegency}`}
          >
            <Navigation className="w-3 h-3" />
            <span>Lokasi Saya</span>
          </button>
        )}
      </div>

      <div className="bg-neutral-50 rounded-2xl p-3.5 border border-neutral-200/90 flex flex-col gap-3">
        {/* Dropdown Provinsi */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-form-province" className="text-xs font-bold text-neutral-800">
            Provinsi
          </label>
          <div className="relative">
            <select
              id="filter-form-province"
              value={selectedProvince || ''}
              onChange={(e) => onProvinceChange(e.target.value)}
              className="w-full h-10 px-3.5 pr-8 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-xs font-medium focus-ring cursor-pointer hover:border-neutral-400"
            >
              <option value="">Semua Provinsi (Seluruh Kalimantan)</option>
              {KALIMANTAN_PROVINCES.map((prov) => (
                <option key={prov.name} value={prov.name}>
                  {prov.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Dropdown Kabupaten/Kota */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-form-regency" className="text-xs font-bold text-neutral-800">
            Kabupaten / Kota
          </label>
          <div className="relative">
            <select
              id="filter-form-regency"
              value={selectedRegency || ''}
              onChange={(e) => onRegencyChange(e.target.value)}
              className="w-full h-10 px-3.5 pr-8 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-xs font-medium focus-ring cursor-pointer hover:border-neutral-400"
            >
              <option value="">Semua Kabupaten / Kota</option>
              {availableRegencies.map((reg) => (
                <option key={reg.name} value={reg.name}>
                  {reg.name}
                  {!selectedProvince && 'provinceName' in reg ? ` (${(reg as any).provinceName})` : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Dropdown Kecamatan */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-form-district" className="text-xs font-bold text-neutral-800">
            Kecamatan
          </label>
          <div className="relative">
            <select
              id="filter-form-district"
              value={selectedDistrict || ''}
              onChange={(e) => onDistrictChange(e.target.value ? e.target.value : null)}
              disabled={!selectedRegency}
              className={cn(
                'w-full h-10 px-3.5 pr-8 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-xs font-medium focus-ring',
                selectedRegency
                  ? 'cursor-pointer hover:border-neutral-400'
                  : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              )}
            >
              <option value="">
                {selectedRegency ? 'Semua Kecamatan' : 'Pilih Kabupaten/Kota terlebih dahulu'}
              </option>
              {availableDistricts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
