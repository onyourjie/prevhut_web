import { useState } from 'react'
import { MapPin, Clock, Calendar, Flame, Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SINTANG_DISTRICTS, USER_CURRENT_LOCATION } from '../mock-data'
import type { MapFilter, PriorityLevel } from '../schemas'

export interface AreaFilterFormProps {
  currentFilter: MapFilter
  onApply: (filter: MapFilter) => void
  onReset?: () => void
  className?: string
}

export function AreaFilterForm({
  currentFilter,
  onApply,
  onReset,
  className,
}: AreaFilterFormProps) {
  const [selectedRegency] = useState(currentFilter.regency || USER_CURRENT_LOCATION.name)
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(
    currentFilter.district,
  )
  const [selectedDate, setSelectedDate] = useState(currentFilter.date || '2026-09-24')
  const [selectedPriorities, setSelectedPriorities] = useState<PriorityLevel[]>(
    currentFilter.priorities || ['P1', 'P2', 'P3'],
  )

  const handleReset = () => {
    setSelectedDistrict(null)
    setSelectedDate('2026-09-24')
    setSelectedPriorities(['P1', 'P2', 'P3'])
    onReset?.()
  }

  const togglePriority = (p: PriorityLevel) => {
    if (selectedPriorities.includes(p)) {
      if (selectedPriorities.length > 1) {
        setSelectedPriorities(selectedPriorities.filter((item) => item !== p))
      }
    } else {
      setSelectedPriorities([...selectedPriorities, p])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onApply({
      regency: selectedRegency,
      district: selectedDistrict,
      date: selectedDate,
      priorities: selectedPriorities,
    })
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex flex-col gap-5 select-none', className)}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
          <MapPin className="w-4 h-4" />
          <span>Cakupan Wilayah</span>
        </div>

        <div className="bg-neutral-50 rounded-2xl p-3.5 border border-neutral-200/90 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-form-regency" className="text-xs font-bold text-neutral-800">
              Kabupaten/Kota
            </label>
            <input
              id="filter-form-regency"
              type="text"
              readOnly
              value={selectedRegency}
              className="w-full h-10 px-3.5 rounded-xl border border-neutral-300 bg-neutral-100 text-neutral-700 text-xs font-semibold cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-form-district" className="text-xs font-bold text-neutral-800">
              Kecamatan
            </label>
            <div className="relative">
              <select
                id="filter-form-district"
                value={selectedDistrict || ''}
                onChange={(e) => setSelectedDistrict(e.target.value ? e.target.value : null)}
                className="w-full h-10 px-3.5 pr-8 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-xs font-medium focus-ring cursor-pointer hover:border-neutral-400"
              >
                <option value="">Semua Kecamatan</option>
                {SINTANG_DISTRICTS.map((dist) => (
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

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
          <Clock className="w-4 h-4" />
          <span>Waktu Pengamatan</span>
        </div>

        <div className="bg-neutral-50 rounded-2xl p-3.5 border border-neutral-200/90 flex flex-col gap-1.5">
          <label htmlFor="filter-form-date" className="text-xs font-bold text-neutral-800">
            Tanggal Observasi Satelit
          </label>
          <div className="relative flex items-center">
            <input
              id="filter-form-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-10 px-3.5 pr-8 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-xs font-medium focus-ring cursor-pointer"
            />
            <Calendar className="w-4 h-4 text-neutral-500 absolute right-2.5 pointer-events-none" />
          </div>
          <span className="text-[11px] text-neutral-500">
            {selectedDate === '2026-09-24' ? 'Hari ini' : selectedDate}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
          <Flame className="w-4 h-4" />
          <span>Tingkat Prioritas</span>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => togglePriority('P1')}
            aria-pressed={selectedPriorities.includes('P1')}
            className={cn(
              'w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer focus-ring',
              selectedPriorities.includes('P1')
                ? 'border-error-300 bg-error-50/70 text-error-900'
                : 'border-neutral-200 bg-white text-neutral-500 opacity-60',
            )}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                  selectedPriorities.includes('P1')
                    ? 'border-error-600 bg-error-600 text-white'
                    : 'border-neutral-300 bg-white',
                )}
              >
                {selectedPriorities.includes('P1') && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="font-bold text-error-700">P1</span>
              <span>-</span>
              <span>Prioritas Tinggi</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-error-600" />
          </button>

          <button
            type="button"
            onClick={() => togglePriority('P2')}
            aria-pressed={selectedPriorities.includes('P2')}
            className={cn(
              'w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer focus-ring',
              selectedPriorities.includes('P2')
                ? 'border-warning-300 bg-warning-50/70 text-warning-950'
                : 'border-neutral-200 bg-white text-neutral-500 opacity-60',
            )}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                  selectedPriorities.includes('P2')
                    ? 'border-warning-600 bg-warning-600 text-white'
                    : 'border-neutral-300 bg-white',
                )}
              >
                {selectedPriorities.includes('P2') && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="font-bold text-warning-700">P2</span>
              <span>-</span>
              <span>Perhatian Meningkat</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-warning-600" />
          </button>

          <button
            type="button"
            onClick={() => togglePriority('P3')}
            aria-pressed={selectedPriorities.includes('P3')}
            className={cn(
              'w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer focus-ring',
              selectedPriorities.includes('P3')
                ? 'border-purple-300 bg-purple-50/70 text-purple-950'
                : 'border-neutral-200 bg-white text-neutral-500 opacity-60',
            )}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                  selectedPriorities.includes('P3')
                    ? 'border-purple-600 bg-purple-600 text-white'
                    : 'border-neutral-300 bg-white',
                )}
              >
                {selectedPriorities.includes('P3') && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="font-bold text-purple-700">P3</span>
              <span>-</span>
              <span>Tetap Dipantau</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="flex-1"
        >
          Reset
        </Button>
        <Button type="submit" variant="primary" size="sm" className="flex-1">
          Terapkan
        </Button>
      </div>
    </form>
  )
}
