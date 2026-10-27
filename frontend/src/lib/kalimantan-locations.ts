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
          "Kecamatan Singkup",
          "Kecamatan Manis Mata",
          "Kecamatan Sandai",
          "Kecamatan Marau",
          "Kecamatan Hulu Sungai",
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
          "Kecamatan Sekayam",
        ],
      },
      {
        name: "Kabupaten Kapuas Hulu",
        lat: 0.8172,
        lng: 112.9328,
        districts: [
          "Kecamatan Putussibau Utara",
          "Kecamatan Putussibau Selatan",
          "Kecamatan Semitau",
          "Kecamatan Badau",
          "Kecamatan Bika",
        ],
      },
      {
        name: "Kabupaten Melawi",
        lat: -0.3300,
        lng: 111.7500,
        districts: ["Kecamatan Nanga Pinoh", "Kecamatan Ella Hilir"],
      },
      {
        name: "Kabupaten Sekadau",
        lat: 0.0200,
        lng: 110.9500,
        districts: ["Kecamatan Sekadau Hilir", "Kecamatan Belitang Hilir"],
      },
      {
        name: "Kabupaten Landak",
        lat: 0.3800,
        lng: 109.9500,
        districts: ["Kecamatan Ngabang", "Kecamatan Mandor"],
      },
      {
        name: "Kabupaten Bengkayang",
        lat: 0.8200,
        lng: 109.6500,
        districts: ["Kecamatan Bengkayang", "Kecamatan Sungai Raya Kepulauan"],
      },
      {
        name: "Kabupaten Kayong Utara",
        lat: -1.2500,
        lng: 109.9500,
        districts: ["Kecamatan Sukadana", "Kecamatan Simpang Hilir"],
      },
      {
        name: "Kabupaten Mempawah",
        lat: 0.3500,
        lng: 108.9600,
        districts: ["Kecamatan Mempawah Hilir", "Kecamatan Sungai Pinyuh", "Kecamatan Siantan"],
      },
      {
        name: "Kota Singkawang",
        lat: 0.9050,
        lng: 108.9850,
        districts: ["Kecamatan Singkawang Barat", "Kecamatan Singkawang Selatan"],
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
        districts: [
          "Kecamatan Arut Selatan",
          "Kecamatan Kumai",
          "Kecamatan Pangkalan Lada",
          "Kecamatan Kotawaringin Lama",
          "Kecamatan Pangkalan Banteng",
        ],
      },
      {
        name: "Kabupaten Kotawaringin Timur",
        lat: -2.5317,
        lng: 112.9536,
        districts: [
          "Kecamatan Mentawa Baru Ketapang",
          "Kecamatan Baamang",
          "Kecamatan Mentaya Hilir Selatan",
          "Kecamatan Mentaya Hilir Utara",
          "Kecamatan Parenggean",
          "Kecamatan Cempaga",
          "Kecamatan Antang Kalang",
          "Kecamatan Teluk Sampit",
          "Kecamatan Seranau",
        ],
      },
      {
        name: "Kabupaten Seruyan",
        lat: -2.5000,
        lng: 112.2000,
        districts: [
          "Kecamatan Hanau",
          "Kecamatan Danau Seluluk",
          "Kecamatan Seruyan Hilir",
          "Kecamatan Seruyan Hilir Timur",
          "Kecamatan Danau Sembuluh",
          "Kecamatan Seruyan Raya",
          "Kecamatan Seruyan Tengah",
          "Kecamatan Seruyan Hulu",
        ],
      },
      {
        name: "Kabupaten Kapuas",
        lat: -3.0093,
        lng: 114.3828,
        districts: [
          "Kecamatan Selat",
          "Kecamatan Basarang",
          "Kecamatan Kapuas Murung",
          "Kecamatan Timpah",
          "Kecamatan Mantangai",
          "Kecamatan Kapuas Tengah",
        ],
      },
      {
        name: "Kabupaten Pulang Pisau",
        lat: -2.7533,
        lng: 114.2541,
        districts: [
          "Kecamatan Kahayan Hilir",
          "Kecamatan Pandih Batu",
          "Kecamatan Maliku",
          "Kecamatan Jabiren Raya",
          "Kecamatan Kahayan Kuala",
          "Kecamatan Sebangau Kuala",
        ],
      },
      {
        name: "Kabupaten Katingan",
        lat: -1.8950,
        lng: 113.3850,
        districts: [
          "Kecamatan Katingan Hilir",
          "Kecamatan Tasik Payawan",
          "Kecamatan Kamipang",
          "Kecamatan Mendawai",
          "Kecamatan Katingan Kuala",
          "Kecamatan Katingan Tengah",
        ],
      },
      {
        name: "Kabupaten Sukamara",
        lat: -2.6280,
        lng: 111.2370,
        districts: [
          "Kecamatan Sukamara",
          "Kecamatan Jelai",
          "Kecamatan Balai Riam",
          "Kecamatan Pantai Lunci",
        ],
      },
      {
        name: "Kabupaten Lamandau",
        lat: -2.1380,
        lng: 111.4580,
        districts: [
          "Kecamatan Bulik",
          "Kecamatan Delang",
          "Kecamatan Lamandau",
          "Kecamatan Sematu Jaya",
        ],
      },
      {
        name: "Kabupaten Barito Selatan",
        lat: -1.7214,
        lng: 114.8512,
        districts: ["Kecamatan Dusun Selatan", "Kecamatan Dusun Utara", "Kecamatan Jenamas"],
      },
      {
        name: "Kabupaten Barito Utara",
        lat: -0.9500,
        lng: 114.9000,
        districts: ["Kecamatan Teweh Tengah", "Kecamatan Montallat"],
      },
      {
        name: "Kabupaten Barito Timur",
        lat: -2.0200,
        lng: 115.1500,
        districts: ["Kecamatan Dusun Timur", "Kecamatan Benua Lima"],
      },
      {
        name: "Kabupaten Murung Raya",
        lat: -0.6000,
        lng: 114.5800,
        districts: ["Kecamatan Murung", "Kecamatan Permata Intan"],
      },
      {
        name: "Kabupaten Gunung Mas",
        lat: -1.3300,
        lng: 113.8800,
        districts: ["Kecamatan Kurun", "Kecamatan Sepang"],
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
        districts: [
          "Kecamatan Martapura",
          "Kecamatan Gambut",
          "Kecamatan Aluh-Aluh",
          "Kecamatan Karang Intan",
          "Kecamatan Simpang Empat",
        ],
      },
      {
        name: "Kabupaten Tanah Laut",
        lat: -3.7972,
        lng: 114.7785,
        districts: [
          "Kecamatan Pelaihari",
          "Kecamatan Bati-Bati",
          "Kecamatan Jorong",
          "Kecamatan Kintap",
          "Kecamatan Tambang Ulang",
        ],
      },
      {
        name: "Kabupaten Barito Kuala",
        lat: -3.0766,
        lng: 114.5947,
        districts: ["Kecamatan Marabahan", "Kecamatan Alalak", "Kecamatan Mandastana"],
      },
      {
        name: "Kabupaten Tapin",
        lat: -2.9200,
        lng: 115.1500,
        districts: [
          "Kecamatan Tapin Utara",
          "Kecamatan Binuang",
          "Kecamatan Candi Laras Selatan",
          "Kecamatan Candi Laras Utara",
        ],
      },
      {
        name: "Kabupaten Tanah Bumbu",
        lat: -3.4500,
        lng: 116.0000,
        districts: [
          "Kecamatan Batulicin",
          "Kecamatan Satui",
          "Kecamatan Kusan Hilir",
          "Kecamatan Mantewe",
          "Kecamatan Simpang Empat",
        ],
      },
      {
        name: "Kabupaten Kotabaru",
        lat: -3.2954,
        lng: 116.2214,
        districts: [
          "Kecamatan Pulau Laut Utara",
          "Kecamatan Kelumpang Hilir",
          "Kecamatan Kelumpang Hulu",
          "Kecamatan Pamukan Utara",
          "Kecamatan Pulau Laut Selatan",
        ],
      },
      {
        name: "Kabupaten Tabalong",
        lat: -2.1600,
        lng: 115.4200,
        districts: ["Kecamatan Murung Pudak", "Kecamatan Kelua", "Kecamatan Muara Uya"],
      },
      {
        name: "Kabupaten Hulu Sungai Selatan",
        lat: -2.7800,
        lng: 115.2500,
        districts: ["Kecamatan Kandangan", "Kecamatan Daha Selatan"],
      },
      {
        name: "Kabupaten Hulu Sungai Tengah",
        lat: -2.5800,
        lng: 115.3800,
        districts: ["Kecamatan Barabai", "Kecamatan Pandawan"],
      },
      {
        name: "Kabupaten Hulu Sungai Utara",
        lat: -2.4200,
        lng: 115.2500,
        districts: ["Kecamatan Amuntai Tengah", "Kecamatan Danau Panggang"],
      },
      {
        name: "Kabupaten Balangan",
        lat: -2.3500,
        lng: 115.5000,
        districts: ["Kecamatan Paringin", "Kecamatan Awayan"],
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
        name: "Kota Bontang",
        lat: 0.1350,
        lng: 117.4850,
        districts: ["Kecamatan Bontang Utara", "Kecamatan Bontang Selatan"],
      },
      {
        name: "Kabupaten Kutai Kartanegara",
        lat: -0.4428,
        lng: 117.0051,
        districts: [
          "Kecamatan Tenggarong",
          "Kecamatan Samboja",
          "Kecamatan Muara Badak",
          "Kecamatan Loa Janan",
          "Kecamatan Kota Bangun",
          "Kecamatan Marang Kayu",
        ],
      },
      {
        name: "Kabupaten Penajam Paser Utara",
        lat: -1.2425,
        lng: 116.6854,
        districts: ["Kecamatan Penajam", "Kecamatan Sepaku", "Kecamatan Waru"],
      },
      {
        name: "Kabupaten Paser",
        lat: -1.9054,
        lng: 116.2014,
        districts: [
          "Kecamatan Tanah Grogot",
          "Kecamatan Kuaro",
          "Kecamatan Batu Sopang",
          "Kecamatan Long Ikis",
          "Kecamatan Long Kali",
        ],
      },
      {
        name: "Kabupaten Kutai Timur",
        lat: 0.4950,
        lng: 117.5512,
        districts: [
          "Kecamatan Sangatta Utara",
          "Kecamatan Bengalon",
          "Kecamatan Kaliorang",
          "Kecamatan Sangkulirang",
          "Kecamatan Muara Wahau",
        ],
      },
      {
        name: "Kabupaten Berau",
        lat: 2.1556,
        lng: 117.4939,
        districts: ["Kecamatan Tanjung Redeb", "Kecamatan Sambaliung", "Kecamatan Teluk Bayur"],
      },
      {
        name: "Kabupaten Kutai Barat",
        lat: -0.2300,
        lng: 115.7000,
        districts: ["Kecamatan Barong Tongkok", "Kecamatan Melak", "Kecamatan Jempang"],
      },
      {
        name: "Kabupaten Mahakam Hulu",
        lat: 0.1500,
        lng: 115.3500,
        districts: ["Kecamatan Ujoh Bilang", "Kecamatan Long Bagun"],
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
      {
        name: "Kabupaten Tana Tidung",
        lat: 3.5500,
        lng: 117.2500,
        districts: ["Kecamatan Sesayap", "Kecamatan Tana Lia"],
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
