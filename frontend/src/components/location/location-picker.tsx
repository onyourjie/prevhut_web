import { useEffect, useRef, useState } from 'react';
import { Compass, MapPin, AlertTriangle, Loader2 } from 'lucide-react';
import { KALIMANTAN_PROVINCES, isInsideKalimantan } from '@/lib/kalimantan-locations';
import { resolveRegionFromCoords } from '@/lib/geocode';
import { DraggableMiniMap } from '@/components/map/draggable-mini-map';
import { showErrorToast } from '@/lib/swal';

export interface LocationValue {
  province: string;
  kabupaten: string;
  kecamatan: string;
  latitude: number;
  longitude: number;
}

interface LocationPickerProps {
  value: LocationValue;
  onChange: (next: LocationValue) => void;
}

type Source = 'gps' | 'pin' | 'region';

const SOURCE_LABEL: Record<Source, string> = {
  gps: 'Deteksi GPS',
  pin: 'Pin peta',
  region: 'Pilihan wilayah',
};

/** Pastikan nilai saat ini tetap muncul di dropdown walau tidak ada di dataset. */
const withCurrent = (options: string[], current: string) =>
  current && !options.includes(current) ? [current, ...options] : options;

const selectClass =
  'w-full text-xs p-2.5 rounded-xl border border-neutral-300 bg-white focus:ring-2 focus:ring-brand-500/20';

/**
 * Pemilih lokasi dengan 3 cara (GPS, pilih wilayah, geser pin peta).
 * Ketiganya memakai satu nilai yang sama: apa pun yang dipilih langsung
 * memperbarui dua lainnya, sehingga hasilnya selalu konsisten.
 */
export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [source, setSource] = useState<Source | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  const requestId = useRef(0);
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const inside = isInsideKalimantan(value.latitude, value.longitude);

  // GPS & pin: koordinat jadi acuan, wilayah dicari dari koordinat tersebut
  const applyCoordinates = async (lat: number, lng: number, src: Source) => {
    const id = ++requestId.current;
    setSource(src);
    onChange({ ...valueRef.current, latitude: lat, longitude: lng }); // pin pindah seketika
    setIsResolving(true);
    try {
      const region = await resolveRegionFromCoords(lat, lng);
      if (id !== requestId.current) return; // ada aksi yang lebih baru
      onChange({
        province: region.province,
        kabupaten: region.kabupaten,
        kecamatan: region.kecamatan,
        latitude: lat,
        longitude: lng,
      });
    } catch {
      // dibatalkan / gagal: biarkan koordinat saja
    } finally {
      if (id === requestId.current) setIsResolving(false);
    }
  };

  // Dropdown: wilayah jadi acuan, pin dipindah ke pusat wilayah tersebut
  const applyRegion = (province: string, kabupaten: string) => {
    requestId.current++; // batalkan pencarian wilayah yang masih berjalan
    setIsResolving(false);
    setSource('region');
    const prov = KALIMANTAN_PROVINCES.find((p) => p.name === province);
    const reg = prov?.regencies.find((r) => r.name === kabupaten);
    if (prov && reg) {
      onChange({
        province,
        kabupaten,
        kecamatan: reg.districts[0] || '',
        latitude: reg.lat,
        longitude: reg.lng,
      });
    }
  };

  const handleProvinceChange = (name: string) => {
    const prov = KALIMANTAN_PROVINCES.find((p) => p.name === name);
    if (prov && prov.regencies.length > 0) applyRegion(name, prov.regencies[0].name);
  };

  const handleKabupatenChange = (name: string) => applyRegion(value.province, name);

  const handleKecamatanChange = (name: string) => {
    setSource('region');
    onChange({ ...value, kecamatan: name });
  };

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      showErrorToast('Browser Anda tidak mendukung deteksi GPS');
      return;
    }
    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingGps(false);
        applyCoordinates(
          Number(pos.coords.latitude.toFixed(5)),
          Number(pos.coords.longitude.toFixed(5)),
          'gps'
        );
      },
      () => {
        setIsDetectingGps(false);
        showErrorToast('Izin lokasi ditolak. Anda tetap bisa memilih wilayah atau menggeser pin.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const currentProv = KALIMANTAN_PROVINCES.find((p) => p.name === value.province);
  const regencyOptions = withCurrent(currentProv?.regencies.map((r) => r.name) || [], value.kabupaten);
  const currentReg = currentProv?.regencies.find((r) => r.name === value.kabupaten);
  const districtOptions = currentReg ? withCurrent(currentReg.districts, value.kecamatan) : [];

  return (
    <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-brand-600" />
          <span className="text-xs font-bold text-neutral-900">Titik Lokasi &amp; Domisili</span>
        </div>

        <button
          type="button"
          onClick={handleDetectGps}
          disabled={isDetectingGps}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-brand-300 bg-brand-50 text-brand-800 text-[11px] font-bold hover:bg-brand-100 transition shadow-2xs disabled:opacity-60"
        >
          <Compass className={`w-3.5 h-3.5 text-brand-600 ${isDetectingGps ? 'animate-spin' : ''}`} />
          <span>{isDetectingGps ? 'Mendeteksi...' : 'Deteksi GPS'}</span>
        </button>
      </div>

      <p className="text-[11px] text-neutral-500 leading-snug">
        Pilih salah satu cara: GPS, pilih wilayah, atau geser pin di peta. Ketiganya selalu
        saling menyesuaikan.
      </p>

      {/* Provinsi */}
      <div>
        <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Provinsi</label>
        <select
          value={value.province}
          onChange={(e) => handleProvinceChange(e.target.value)}
          className={selectClass}
        >
          {withCurrent(KALIMANTAN_PROVINCES.map((p) => p.name), value.province).map((name) => (
            <option key={name} value={name}>
              {name}
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
          value={value.kabupaten}
          onChange={(e) => handleKabupatenChange(e.target.value)}
          className={selectClass}
        >
          {!value.kabupaten && <option value="">-</option>}
          {regencyOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Kecamatan */}
      <div>
        <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Kecamatan</label>
        {districtOptions.length > 0 ? (
          <select
            value={value.kecamatan}
            onChange={(e) => handleKecamatanChange(e.target.value)}
            className={selectClass}
          >
            {!value.kecamatan && <option value="">Pilih Kecamatan</option>}
            {districtOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            placeholder="Ketik nama kecamatan..."
            value={value.kecamatan}
            onChange={(e) => handleKecamatanChange(e.target.value)}
            className={selectClass}
          />
        )}
      </div>

      {/* Status sinkronisasi */}
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <span className="font-mono text-neutral-500">
          {value.latitude.toFixed(4)}, {value.longitude.toFixed(4)}
        </span>
        <span className="flex items-center gap-1 text-neutral-600 font-medium">
          {isResolving ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Mencari nama wilayah...
            </>
          ) : source ? (
            <>Diatur lewat: {SOURCE_LABEL[source]}</>
          ) : null}
        </span>
      </div>

      {!inside && (
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-[11px] text-amber-900 leading-snug">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            Titik ini berada di luar Kalimantan. Firezone memantau karhutla Kalimantan, jadi pilih
            wilayah atau geser pin ke Kalimantan bila ingin lokasi laporan sesuai.
          </span>
        </div>
      )}

      {/* Peta */}
      <DraggableMiniMap
        latitude={value.latitude}
        longitude={value.longitude}
        title="Geser pin atau ketuk peta untuk menandai titik"
        onChange={(lat, lng) => applyCoordinates(lat, lng, 'pin')}
      />
    </div>
  );
}
