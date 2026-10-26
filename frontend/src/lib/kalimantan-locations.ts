export interface RegencyData {
  name: string;
  lat: number;
  lng: number;
  districts: string[];
}

export interface ProvinceData {
  name: string;
  lat: number;
  lng: number;
  regencies: RegencyData[];
}

export const KALIMANTAN_PROVINCES: ProvinceData[] = [
  {
    name: "Kalimantan Barat",
    lat: -0.1255,
    lng: 111.4822,
    regencies: [
      {
        name: "Kabupaten Sintang",
        lat: -0.1255,
        lng: 111.4822,
        districts: [
          "Kecamatan Sintang",
          "Kecamatan Sungai Tebelian",
          "Kecamatan Kelam Permai",
          "Kecamatan Dedai",
          "Kecamatan Sepauk",
          "Kecamatan Tempunak",
          "Kecamatan Kayan Hilir",
        ],
      },
      {
        name: "Kota Pontianak",
        lat: -0.0263,
        lng: 109.3425,
        districts: [
          "Kecamatan Pontianak Kota",
          "Kecamatan Pontianak Selatan",
          "Kecamatan Pontianak Barat",
          "Kecamatan Pontianak Utara",
          "Kecamatan Pontianak Tenggara",
        ],
      },
      {
        name: "Kabupaten Kubu Raya",
        lat: -0.1558,
        lng: 109.4312,
        districts: [
          "Kecamatan Sungai Raya",
          "Kecamatan Rasau Jaya",
          "Kecamatan Sungai Ambawang",
          "Kecamatan Kuala Mandor B",
        ],
      },
      {
        name: "Kabupaten Ketapang",
        lat: -1.8465,
        lng: 109.9714,
        districts: [
          "Kecamatan Delta Pawan",
          "Kecamatan Matan Hilir Selatan",
          "Kecamatan Kendawangan",
          "Kecamatan Muara Pawan",
        ],
      },
      {
        name: "Kabupaten Sambas",
        lat: 1.3653,
        lng: 109.3039,
        districts: [
          "Kecamatan Sambas",
          "Kecamatan Pemangkat",
          "Kecamatan Tebas",
          "Kecamatan Teluk Keramat",
        ],
      },
      {
        name: "Kabupaten Sanggau",
        lat: 0.1238,
        lng: 110.5898,
        districts: [
          "Kecamatan Kapuas",
          "Kecamatan Parindu",
          "Kecamatan Tayan Hilir",
          "Kecamatan Beduai",
        ],
      },
      {
        name: "Kabupaten Kapuas Hulu",
        lat: 0.8172,
        lng: 112.9328,
        districts: ["Kecamatan Putussibau Utara", "Kecamatan Putussibau Selatan", "Kecamatan Bika"],
      },
    ],
  },
  {
    name: "Kalimantan Tengah",
    lat: -2.2161,
    lng: 113.9139,
    regencies: [
      {
        name: "Kota Palangka Raya",
        lat: -2.2161,
        lng: 113.9139,
        districts: ["Kecamatan Jekan Raya", "Kecamatan Pahandut", "Kecamatan Sebangau", "Kecamatan Bukit Batu"],
      },
      {
        name: "Kabupaten Kotawaringin Barat",
        lat: -2.6833,
        lng: 111.625,
        districts: ["Kecamatan Arut Selatan", "Kecamatan Kumai", "Kecamatan Pangkalan Lada"],
      },
      {
        name: "Kabupaten Kotawaringin Timur",
        lat: -2.5317,
        lng: 112.9536,
        districts: ["Kecamatan Mentawa Baru Ketapang", "Kecamatan Baamang", "Kecamatan Seranau"],
      },
      {
        name: "Kabupaten Kapuas",
        lat: -3.0093,
        lng: 114.3828,
        districts: ["Kecamatan Selat", "Kecamatan Kapuas Murung", "Kecamatan Basarang"],
      },
      {
        name: "Kabupaten Pulang Pisau",
        lat: -2.7533,
        lng: 114.2541,
        districts: ["Kecamatan Kahayan Hilir", "Kecamatan Maliku", "Kecamatan Pandih Batu"],
      },
      {
        name: "Kabupaten Seruyan",
        lat: -2.3392,
        lng: 112.5583,
        districts: ["Kecamatan Hanau", "Kecamatan Seruyan Hilir", "Kecamatan Danau Sembuluh", "Kecamatan Seruyan Tengah"],
      },
    ],
  },
  {
    name: "Kalimantan Selatan",
    lat: -3.3194,
    lng: 114.5908,
    regencies: [
      {
        name: "Kota Banjarmasin",
        lat: -3.3194,
        lng: 114.5908,
        districts: ["Kecamatan Banjarmasin Tengah", "Kecamatan Banjarmasin Selatan", "Kecamatan Banjarmasin Utara"],
      },
      {
        name: "Kota Banjarbaru",
        lat: -3.4402,
        lng: 114.8306,
        districts: ["Kecamatan Banjarbaru Selatan", "Kecamatan Banjarbaru Utara", "Kecamatan Landasan Ulin"],
      },
      {
        name: "Kabupaten Banjar",
        lat: -3.4144,
        lng: 115.0768,
        districts: ["Kecamatan Martapura", "Kecamatan Gambut", "Kecamatan Karang Intan"],
      },
      {
        name: "Kabupaten Tanah Laut",
        lat: -3.7972,
        lng: 114.7785,
        districts: ["Kecamatan Pelaihari", "Kecamatan Bati-Bati", "Kecamatan Tambang Ulang"],
      },
      {
        name: "Kabupaten Barito Kuala",
        lat: -3.0766,
        lng: 114.5947,
        districts: ["Kecamatan Marabahan", "Kecamatan Alalak", "Kecamatan Mandastana"],
      },
    ],
  },
  {
    name: "Kalimantan Timur",
    lat: -0.5022,
    lng: 117.1536,
    regencies: [
      {
        name: "Kota Samarinda",
        lat: -0.5022,
        lng: 117.1536,
        districts: ["Kecamatan Samarinda Kota", "Kecamatan Samarinda Ulu", "Kecamatan Sungai Kunjang"],
      },
      {
        name: "Kota Balikpapan",
        lat: -1.2654,
        lng: 116.8312,
        districts: ["Kecamatan Balikpapan Kota", "Kecamatan Balikpapan Selatan", "Kecamatan Balikpapan Utara"],
      },
      {
        name: "Kabupaten Kutai Kartanegara",
        lat: -0.4428,
        lng: 117.0051,
        districts: ["Kecamatan Tenggarong", "Kecamatan Samboja", "Kecamatan Muara Badak", "Kecamatan Loa Janan"],
      },
      {
        name: "Kabupaten Penajam Paser Utara",
        lat: -1.2425,
        lng: 116.6854,
        districts: ["Kecamatan Penajam", "Kecamatan Sepaku", "Kecamatan Waru"],
      },
      {
        name: "Kabupaten Berau",
        lat: 2.1556,
        lng: 117.4939,
        districts: ["Kecamatan Tanjung Redeb", "Kecamatan Sambaliung", "Kecamatan Teluk Bayur"],
      },
    ],
  },
  {
    name: "Kalimantan Utara",
    lat: 3.327,
    lng: 117.5965,
    regencies: [
      {
        name: "Kota Tarakan",
        lat: 3.327,
        lng: 117.5965,
        districts: ["Kecamatan Tarakan Tengah", "Kecamatan Tarakan Barat", "Kecamatan Tarakan Timur"],
      },
      {
        name: "Kabupaten Bulungan",
        lat: 2.9041,
        lng: 117.3643,
        districts: ["Kecamatan Tanjung Selor", "Kecamatan Tanjung Palas", "Kecamatan Sekatak"],
      },
      {
        name: "Kabupaten Nunukan",
        lat: 4.1357,
        lng: 117.6467,
        districts: ["Kecamatan Nunukan", "Kecamatan Sebatik", "Kecamatan Krayan"],
      },
      {
        name: "Kabupaten Malinau",
        lat: 3.5843,
        lng: 116.6388,
        districts: ["Kecamatan Malinau Kota", "Kecamatan Malinau Barat"],
      },
    ],
  },
];

export function getRegencyCoordinates(provinceName?: string, regencyName?: string): { lat: number; lng: number } {
  if (provinceName && regencyName) {
    const prov = KALIMANTAN_PROVINCES.find((p) => p.name.toLowerCase() === provinceName.toLowerCase());
    if (prov) {
      const reg = prov.regencies.find((r) => r.name.toLowerCase() === regencyName.toLowerCase());
      if (reg) {
        return { lat: reg.lat, lng: reg.lng };
      }
      return { lat: prov.lat, lng: prov.lng };
    }
  }

  if (regencyName) {
    for (const p of KALIMANTAN_PROVINCES) {
      const reg = p.regencies.find((r) => r.name.toLowerCase() === regencyName.toLowerCase());
      if (reg) return { lat: reg.lat, lng: reg.lng };
    }
  }

  // Default Sintang, Kalbar
  return { lat: -0.1255, lng: 111.4822 };
}

export function isInsideKalimantan(lat: number, lng: number): boolean {
  return lat >= -4.5 && lat <= 4.5 && lng >= 108.5 && lng <= 119.5;
}
