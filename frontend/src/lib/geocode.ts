import { KALIMANTAN_PROVINCES, isInsideKalimantan } from './kalimantan-locations';

export interface ResolvedRegion {
  province: string;
  kabupaten: string;
  kecamatan: string;
  /** true jika koordinat berada di wilayah Kalimantan */
  insideKalimantan: boolean;
}

/** Hapus awalan administratif agar nama mudah dibandingkan. */
const normalize = (name?: string | null) =>
  (name || '')
    .toLowerCase()
    .replace(/^(provinsi|kabupaten|kab\.|kota|kecamatan|kec\.)\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();

const toRad = (deg: number) => (deg * Math.PI) / 180;

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Kabupaten/kota terdekat dari dataset berdasarkan titik pusat. */
function nearestRegency(lat: number, lng: number) {
  let best: {
    province: string;
    regency: (typeof KALIMANTAN_PROVINCES)[number]['regencies'][number];
  } | null = null;
  let bestDist = Infinity;
  for (const prov of KALIMANTAN_PROVINCES) {
    for (const reg of prov.regencies) {
      const d = distanceKm(lat, lng, reg.lat, reg.lng);
      if (d < bestDist) {
        bestDist = d;
        best = { province: prov.name, regency: reg };
      }
    }
  }
  return best;
}

interface NominatimAddress {
  state?: string;
  county?: string;
  city?: string;
  regency?: string;
  municipality?: string;
  town?: string;
  city_district?: string;
  district?: string;
  suburb?: string;
  village?: string;
}

async function fetchNominatim(lat: number, lng: number, signal?: AbortSignal) {
  const url =
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=14` +
    `&accept-language=id&lat=${lat}&lon=${lng}`;
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('Reverse geocode gagal');
  const data = await res.json();
  return (data?.address || {}) as NominatimAddress;
}

const withPrefix = (value: string, prefix: string) =>
  /^(kabupaten|kota|kecamatan)\s/i.test(value) ? value : `${prefix} ${value}`;

/**
 * Menentukan Provinsi, Kabupaten/Kota, dan Kecamatan dari koordinat.
 * Dipakai oleh GPS, pin peta, maupun toggle GPS agar semuanya menghasilkan data yang sama.
 */
export async function resolveRegionFromCoords(
  lat: number,
  lng: number,
  signal?: AbortSignal
): Promise<ResolvedRegion> {
  const inside = isInsideKalimantan(lat, lng);

  let addr: NominatimAddress = {};
  try {
    addr = await fetchNominatim(lat, lng, signal);
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') throw err;
    // Jaringan gagal: lanjut dengan fallback jarak terdekat di bawah
  }

  const nomState = addr.state || '';
  const nomRegency = addr.county || addr.city || addr.regency || addr.municipality || addr.town || '';
  // Hanya city_district/district yang setara kecamatan; suburb/village adalah kelurahan/desa
  const nomDistrict = addr.city_district || addr.district || '';

  if (inside) {
    // 1) Cocokkan nama dari OSM dengan dataset
    for (const prov of KALIMANTAN_PROVINCES) {
      for (const reg of prov.regencies) {
        if (nomRegency && normalize(reg.name) === normalize(nomRegency)) {
          const district =
            reg.districts.find((d) => normalize(d) === normalize(nomDistrict)) ||
            (nomDistrict ? withPrefix(nomDistrict, 'Kecamatan') : '');
          return {
            province: prov.name,
            kabupaten: reg.name,
            kecamatan: district,
            insideKalimantan: true,
          };
        }
      }
    }

    // 2) Fallback: kabupaten/kota terdekat di dataset
    const nearest = nearestRegency(lat, lng);
    if (nearest) {
      const province =
        KALIMANTAN_PROVINCES.find((p) => normalize(p.name) === normalize(nomState))?.name ||
        nearest.province;
      const district =
        nearest.regency.districts.find((d) => normalize(d) === normalize(nomDistrict)) ||
        (nomDistrict ? withPrefix(nomDistrict, 'Kecamatan') : '');
      return {
        province,
        kabupaten: nearest.regency.name,
        kecamatan: district,
        insideKalimantan: true,
      };
    }
  }

  // Di luar Kalimantan: tampilkan apa adanya sesuai lokasi sebenarnya
  return {
    province: nomState || 'Di luar Kalimantan',
    kabupaten: nomRegency || '',
    kecamatan: nomDistrict ? withPrefix(nomDistrict, 'Kecamatan') : '',
    insideKalimantan: false,
  };
}
