import React, { useState } from 'react';
import { X, Filter, RotateCcw } from 'lucide-react';
import { KALIMANTAN_PROVINCES } from '@/lib/kalimantan-locations';

export interface FilterState {
  category?: 'DARURAT' | 'INFORMASI' | '';
  provinsi?: string;
  kabupaten?: string;
  kecamatan?: string;
  timeRange?: string;
}

export interface FilterModalProps {
  currentFilter: FilterState;
  onApply: (filter: FilterState) => void;
  onClose: () => void;
}

export function FilterModal({ currentFilter, onApply, onClose }: FilterModalProps) {
  const [filter, setFilter] = useState<FilterState>(currentFilter);

  const selectedProv = KALIMANTAN_PROVINCES.find((p) => p.name === filter.provinsi);
  const availableKabupatens = selectedProv ? selectedProv.regencies : [];
  const selectedKab = availableKabupatens.find((k) => k.name === filter.kabupaten);
  const availableDistricts = selectedKab ? selectedKab.districts : [];

  const handleReset = () => {
    const emptyFilter: FilterState = {
      category: '',
      provinsi: '',
      kabupaten: '',
      kecamatan: '',
      timeRange: '',
    };
    setFilter(emptyFilter);
    onApply(emptyFilter);
    onClose();
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(filter);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Header */}
        <div className="p-5 pb-3 flex items-center justify-between border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-600" />
            <h2 className="text-base font-extrabold text-neutral-900">
              Filter Postingan
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-neutral-500 hover:text-brand-600 px-2 py-1 transition flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleApply} className="p-5 overflow-y-auto space-y-5 text-left">
          {/* Kategori */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-2">
              Kategori
            </label>
            <p className="text-[11px] text-neutral-400 mb-2.5">
              Pilih kategori tag pada postingan
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Semua', value: '' },
                { label: 'Darurat', value: 'DARURAT' },
                { label: 'Informasi', value: 'INFORMASI' },
              ].map((cat) => {
                const isActive = (filter.category || '') === cat.value;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => setFilter({ ...filter, category: cat.value as any })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                      isActive
                        ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wilayah */}
          <div className="space-y-3 pt-1 border-t border-neutral-100">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Wilayah Cakupan
              </label>
              <p className="text-[11px] text-neutral-400 mb-2.5">
                Batasi cakupan wilayah postingan
              </p>
            </div>

            {/* Provinsi */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                Provinsi
              </label>
              <select
                value={filter.provinsi || ''}
                onChange={(e) =>
                  setFilter({ ...filter, provinsi: e.target.value, kabupaten: '', kecamatan: '' })
                }
                className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              >
                <option value="">Pilih provinsi (Semua Kalimantan)</option>
                {KALIMANTAN_PROVINCES.map((prov) => (
                  <option key={prov.name} value={prov.name}>
                    {prov.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Kabupaten / Kota */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                Kabupaten / Kota
              </label>
              <select
                value={filter.kabupaten || ''}
                onChange={(e) =>
                  setFilter({ ...filter, kabupaten: e.target.value, kecamatan: '' })
                }
                disabled={!filter.provinsi}
                className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 disabled:bg-neutral-100 disabled:text-neutral-400"
              >
                <option value="">
                  {filter.provinsi ? 'Pilih kabupaten/kota' : 'Pilih provinsi terlebih dahulu'}
                </option>
                {availableKabupatens.map((kab) => (
                  <option key={kab.name} value={kab.name}>
                    {kab.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Kecamatan */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                Kecamatan
              </label>
              {availableDistricts.length > 0 ? (
                <select
                  value={filter.kecamatan || ''}
                  onChange={(e) => setFilter({ ...filter, kecamatan: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  <option value="">Pilih kecamatan (Semua)</option>
                  {availableDistricts.map((kec) => (
                    <option key={kec} value={kec}>
                      {kec}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Masukkan nama kecamatan..."
                  value={filter.kecamatan || ''}
                  onChange={(e) => setFilter({ ...filter, kecamatan: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-[0.99] transition shadow-sm"
            >
              Terapkan Filter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
