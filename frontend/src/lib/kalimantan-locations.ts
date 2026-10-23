export interface ProvinceData {
  name: string;
  regencies: {
    name: string;
    districts: string[];
  }[];
}

export const KALIMANTAN_PROVINCES: ProvinceData[] = [
  {
    name: "Kalimantan Barat",
    regencies: [
      {
        name: "Kabupaten Sintang",
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
        districts: [
          "Kecamatan Sungai Raya",
          "Kecamatan Rasau Jaya",
          "Kecamatan Sungai Ambawang",
          "Kecamatan Kuala Mandor B",
        ],
      },
      {
        name: "Kabupaten Ketapang",
        districts: [
          "Kecamatan Delta Pawan",
          "Kecamatan Matan Hilir Selatan",
          "Kecamatan Kendawangan",
          "Kecamatan Muara Pawan",
        ],
      },
      {
        name: "Kabupaten Sambas",
        districts: [
          "Kecamatan Sambas",
          "Kecamatan Pemangkat",
          "Kecamatan Tebas",
          "Kecamatan Teluk Keramat",
        ],
      },
      {
        name: "Kabupaten Sanggau",
        districts: [
          "Kecamatan Kapuas",
          "Kecamatan Parindu",
          "Kecamatan Tayan Hilir",
          "Kecamatan Beduai",
        ],
      },
      {
        name: "Kabupaten Kapuas Hulu",
        districts: ["Kecamatan Putussibau Utara", "Kecamatan Putussibau Selatan", "Kecamatan Bika"],
      },
    ],
  },
  {
    name: "Kalimantan Tengah",
    regencies: [
      {
        name: "Kota Palangka Raya",
        districts: ["Kecamatan Jekan Raya", "Kecamatan Pahandut", "Kecamatan Sebangau", "Kecamatan Bukit Batu"],
      },
      {
        name: "Kabupaten Kotawaringin Barat",
        districts: ["Kecamatan Arut Selatan", "Kecamatan Kumai", "Kecamatan Pangkalan Lada"],
      },
      {
        name: "Kabupaten Kotawaringin Timur",
        districts: ["Kecamatan Mentawa Baru Ketapang", "Kecamatan Baamang", "Kecamatan Seranau"],
      },
      {
        name: "Kabupaten Kapuas",
        districts: ["Kecamatan Selat", "Kecamatan Kapuas Murung", "Kecamatan Basarang"],
      },
      {
        name: "Kabupaten Pulang Pisau",
        districts: ["Kecamatan Kahayan Hilir", "Kecamatan Maliku", "Kecamatan Pandih Batu"],
      },
    ],
  },
  {
    name: "Kalimantan Selatan",
    regencies: [
      {
        name: "Kota Banjarmasin",
        districts: ["Kecamatan Banjarmasin Tengah", "Kecamatan Banjarmasin Selatan", "Kecamatan Banjarmasin Utara"],
      },
      {
        name: "Kota Banjarbaru",
        districts: ["Kecamatan Banjarbaru Selatan", "Kecamatan Banjarbaru Utara", "Kecamatan Landasan Ulin"],
      },
      {
        name: "Kabupaten Banjar",
        districts: ["Kecamatan Martapura", "Kecamatan Gambut", "Kecamatan Karang Intan"],
      },
      {
        name: "Kabupaten Tanah Laut",
        districts: ["Kecamatan Pelaihari", "Kecamatan Bati-Bati", "Kecamatan Tambang Ulang"],
      },
      {
        name: "Kabupaten Barito Kuala",
        districts: ["Kecamatan Marabahan", "Kecamatan Alalak", "Kecamatan Mandastana"],
      },
    ],
  },
  {
    name: "Kalimantan Timur",
    regencies: [
      {
        name: "Kota Samarinda",
        districts: ["Kecamatan Samarinda Kota", "Kecamatan Samarinda Ulu", "Kecamatan Sungai Kunjang"],
      },
      {
        name: "Kota Balikpapan",
        districts: ["Kecamatan Balikpapan Kota", "Kecamatan Balikpapan Selatan", "Kecamatan Balikpapan Utara"],
      },
      {
        name: "Kabupaten Kutai Kartanegara",
        districts: ["Kecamatan Tenggarong", "Kecamatan Samboja", "Kecamatan Muara Badak", "Kecamatan Loa Janan"],
      },
      {
        name: "Kabupaten Penajam Paser Utara",
        districts: ["Kecamatan Penajam", "Kecamatan Sepaku", "Kecamatan Waru"],
      },
      {
        name: "Kabupaten Berau",
        districts: ["Kecamatan Tanjung Redeb", "Kecamatan Sambaliung", "Kecamatan Teluk Bayur"],
      },
    ],
  },
  {
    name: "Kalimantan Utara",
    regencies: [
      {
        name: "Kota Tarakan",
        districts: ["Kecamatan Tarakan Tengah", "Kecamatan Tarakan Barat", "Kecamatan Tarakan Timur"],
      },
      {
        name: "Kabupaten Bulungan",
        districts: ["Kecamatan Tanjung Selor", "Kecamatan Tanjung Palas", "Kecamatan Sekatak"],
      },
      {
        name: "Kabupaten Nunukan",
        districts: ["Kecamatan Nunukan", "Kecamatan Sebatik", "Kecamatan Krayan"],
      },
      {
        name: "Kabupaten Malinau",
        districts: ["Kecamatan Malinau Kota", "Kecamatan Malinau Barat"],
      },
    ],
  },
];
