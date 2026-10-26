import React, { useState, useMemo } from 'react'
import { Clock, Calendar, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { KALIMANTAN_PROVINCES } from '@/lib/kalimantan-locations'
import { useAuthStore } from '@/store/auth.store'
import type { MapFilter, PriorityLevel } from '../schemas'
import { AreaLocationFilter } from './AreaLocationFilter'
import { AreaPrioritySelector } from './AreaPrioritySelector'

export interface AreaFilterFormProps {
  currentFilter: MapFilter
  onApply: (filter: MapFilter) => void
  onReset?: () => void
  isLoading?: boolean
  className?: string
}

export function AreaFilterForm({
  currentFilter,
  onApply,
  onReset,
  isLoading = false,
  className,
}: AreaFilterFormProps) {
  const { user, isAuthenticated } = useAuthStore()
  const userProvince = isAuthenticated && user?.province ? user.province : undefined
  const userRegency = isAuthenticated && user?.kabupaten ? user.kabupaten : undefined
  const userDistrict = isAuthenticated && user?.kecamatan ? user.kecamatan : undefined

  const [selectedProvince, setSelectedProvince] = useState<string | null>(
    currentFilter.province || null
  )
  const [selectedRegency, setSelectedRegency] = useState<string | null>(
    currentFilter.regency || null
  )
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(
    currentFilter.district || null
  )

  const todayStr = new Date().toISOString().slice(0, 10)
  const [selectedDate, setSelectedDate] = useState(currentFilter.date || todayStr)
  const [selectedPriorities, setSelectedPriorities] = useState<PriorityLevel[]>(
    currentFilter.priorities || ['P1', 'P2', 'P3']
  )

  // Daftar Kabupaten sesuai Provinsi yang dipilih
  const availableRegencies = useMemo(() => {
    if (selectedProvince) {
      const prov = KALIMANTAN_PROVINCES.find(
        (p) => p.name.toLowerCase() === selectedProvince.toLowerCase()
      )
      return prov ? prov.regencies : []
    }
    return KALIMANTAN_PROVINCES.flatMap((p) =>
      p.regencies.map((r) => ({ ...r, provinceName: p.name }))
    )
  }, [selectedProvince])

  // Daftar Kecamatan sesuai Kabupaten yang dipilih
  const availableDistricts = useMemo(() => {
    if (!selectedRegency) return []
    for (const p of KALIMANTAN_PROVINCES) {
      const reg = p.regencies.find(
        (r) => r.name.toLowerCase() === selectedRegency.toLowerCase()
      )
      if (reg) return reg.districts
    }
    return []
  }, [selectedRegency])

  const handleProvinceChange = (prov: string) => {
    if (!prov) {
      setSelectedProvince(null)
      setSelectedRegency(null)
      setSelectedDistrict(null)
      return
    }
    setSelectedProvince(prov)
    const provData = KALIMANTAN_PROVINCES.find(
      (p) => p.name.toLowerCase() === prov.toLowerCase()
    )
    if (
      provData &&
      selectedRegency &&
      !provData.regencies.some(
        (r) => r.name.toLowerCase() === selectedRegency.toLowerCase()
      )
    ) {
      setSelectedRegency(null)
      setSelectedDistrict(null)
    }
  }

  const handleRegencyChange = (reg: string) => {
    if (!reg) {
      setSelectedRegency(null)
      setSelectedDistrict(null)
      return
    }
    setSelectedRegency(reg)
    setSelectedDistrict(null)
    if (!selectedProvince) {
      for (const p of KALIMANTAN_PROVINCES) {
        if (p.regencies.some((r) => r.name.toLowerCase() === reg.toLowerCase())) {
          setSelectedProvince(p.name)
          break
        }
      }
    }
  }

  const handleSetToUserLocation = () => {
    if (!isAuthenticated || !userRegency) return
    setSelectedProvince(userProvince || null)
    setSelectedRegency(userRegency || null)
    setSelectedDistrict(userDistrict || null)
    onApply({
      province: userProvince || null,
      regency: userRegency || null,
      district: userDistrict || null,
      date: selectedDate,
      priorities: selectedPriorities,
    })
  }

  const togglePriority = (priority: PriorityLevel) => {
    setSelectedPriorities((prev) => {
      if (prev.includes(priority)) {
        if (prev.length === 1) return prev
        return prev.filter((p) => p !== priority)
      }
      return [...prev, priority]
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onApply({
      province: selectedProvince,
      regency: selectedRegency,
      district: selectedDistrict,
      date: selectedDate,
      priorities: selectedPriorities,
    })
  }

  const handleReset = () => {
    setSelectedProvince(null)
    setSelectedRegency(null)
    setSelectedDistrict(null)
    setSelectedDate(todayStr)
    setSelectedPriorities(['P1', 'P2', 'P3'])
    onReset?.()
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex flex-col gap-5 select-none', className)}>
      {/* Cakupan Wilayah */}
      <AreaLocationFilter
        selectedProvince={selectedProvince}
        selectedRegency={selectedRegency}
        selectedDistrict={selectedDistrict}
        userRegency={userRegency}
        availableRegencies={availableRegencies}
        availableDistricts={availableDistricts}
        onProvinceChange={handleProvinceChange}
        onRegencyChange={handleRegencyChange}
        onDistrictChange={setSelectedDistrict}
        onSetToUserLocation={handleSetToUserLocation}
      />

      {/* Waktu Pengamatan */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
          <Clock className="w-4 h-4" />
          <span>Waktu Pengamatan</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-form-date" className="text-xs font-bold text-neutral-800">
            Tanggal
          </label>
          <div className="relative flex items-center">
            <input
              id="filter-form-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-10 px-3.5 pr-10 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-xs font-medium focus-ring cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Calendar className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <span className="text-[11px] text-neutral-500">
            {selectedDate === todayStr ? 'Hari ini' : selectedDate}
          </span>
        </div>
      </div>

      {/* Tingkat Prioritas */}
      <AreaPrioritySelector
        selectedPriorities={selectedPriorities}
        onTogglePriority={togglePriority}
      />

      {/* Tombol Aksi */}
      <div className="flex items-center gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="flex-1 h-11 text-xs font-semibold border-neutral-300 hover:bg-neutral-100 cursor-pointer"
        >
          Atur Ulang
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="flex-2 h-11 text-xs font-bold bg-brand-700 hover:bg-brand-800 text-white shadow-xs cursor-pointer disabled:opacity-75 disabled:cursor-wait flex items-center justify-center gap-1.5"
        >
          {isLoading ? (
            <span>Sedang mengambil data...</span>
          ) : (
            <span>Terapkan Filter</span>
          )}
        </Button>
      </div>

      {/* Unduh Data Terbuka / Open Government Data CSV (Fitur #5) */}
      <div className="pt-2 border-t border-neutral-200/70">
        <a
          href="http://localhost:3000/hotspots/transparency/download-csv"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-neutral-50/80 hover:bg-neutral-100 text-xs font-semibold text-neutral-700 hover:text-neutral-900 flex items-center justify-center gap-2 transition focus-ring"
        >
          <Download className="w-4 h-4 text-brand-600" />
          <span>Unduh Data Terbuka Kalimantan (CSV)</span>
        </a>
      </div>
    </form>
  )
}
