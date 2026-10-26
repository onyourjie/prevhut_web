import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export interface VolunteerSeedData {
  name: string;
  username: string;
  email: string;
  phone: string;
  province: string;
  kabupaten: string;
  kecamatan: string;
  latitude: number;
  longitude: number;
  avatarUrl: string;
}

export const volunteersData: VolunteerSeedData[] = [
  {
    "name": "Rian Hidayat (Sambas)",
    "username": "relawan_sambas",
    "email": "relawan.sambas@fireline.id",
    "phone": "+6282110000001",
    "province": "Kalimantan Barat",
    "kabupaten": "Kabupaten Sambas",
    "kecamatan": "Kecamatan Sambas",
    "latitude": 1.4854,
    "longitude": 109.3908,
    "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Ahmad Fauzi (Bengkayang)",
    "username": "relawan_bengkayang",
    "email": "relawan.bengkayang@fireline.id",
    "phone": "+6282110000002",
    "province": "Kalimantan Barat",
    "kabupaten": "Kabupaten Bengkayang",
    "kecamatan": "Kecamatan Bengkayang",
    "latitude": 0.9633,
    "longitude": 109.4136,
    "avatarUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Dedi Kurniawan (Landak)",
    "username": "relawan_landak",
    "email": "relawan.landak@fireline.id",
    "phone": "+6282110000003",
    "province": "Kalimantan Barat",
    "kabupaten": "Kabupaten Landak",
    "kecamatan": "Kecamatan Landak",
    "latitude": 0.468,
    "longitude": 109.7452,
    "avatarUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Fajar Pratama (Mempawah)",
    "username": "relawan_mempawah",
    "email": "relawan.mempawah@fireline.id",
    "phone": "+6282110000004",
    "province": "Kalimantan Barat",
    "kabupaten": "Kabupaten Mempawah",
    "kecamatan": "Kecamatan Mempawah",
    "latitude": 0.3973,
    "longitude": 109.122,
    "avatarUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Bayu Saputra (Sanggau)",
    "username": "relawan_sanggau",
    "email": "relawan.sanggau@fireline.id",
    "phone": "+6282110000005",
    "province": "Kalimantan Barat",
    "kabupaten": "Kabupaten Sanggau",
    "kecamatan": "Kecamatan Sanggau",
    "latitude": 0.4002,
    "longitude": 110.3695,
    "avatarUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Eko Prasetyo (Ketapang)",
    "username": "relawan_ketapang",
    "email": "relawan.ketapang@fireline.id",
    "phone": "+6282110000006",
    "province": "Kalimantan Barat",
    "kabupaten": "Kabupaten Ketapang",
    "kecamatan": "Kecamatan Ketapang",
    "latitude": -1.6901,
    "longitude": 110.5108,
    "avatarUrl": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Dimas Anggara (Sintang)",
    "username": "relawan_sintang",
    "email": "relawan.sintang@fireline.id",
    "phone": "+6282110000007",
    "province": "Kalimantan Barat",
    "kabupaten": "Kabupaten Sintang",
    "kecamatan": "Kecamatan Sintang",
    "latitude": 0.1111,
    "longitude": 112.0261,
    "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Rizky Ramadhan (Kapuas Hulu)",
    "username": "relawan_kapuas_hulu",
    "email": "relawan.kapuas_hulu@fireline.id",
    "phone": "+6282110000008",
    "province": "Kalimantan Barat",
    "kabupaten": "Kabupaten Kapuas Hulu",
    "kecamatan": "Kecamatan Kapuas Hulu",
    "latitude": 0.9016,
    "longitude": 112.8876,
    "avatarUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Arif Wibowo (Sekadau)",
    "username": "relawan_sekadau",
    "email": "relawan.sekadau@fireline.id",
    "phone": "+6282110000009",
    "province": "Kalimantan Barat",
    "kabupaten": "Kabupaten Sekadau",
    "kecamatan": "Kecamatan Sekadau",
    "latitude": 0.055,
    "longitude": 110.9838,
    "avatarUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Hendra Gunawan (Melawi)",
    "username": "relawan_melawi",
    "email": "relawan.melawi@fireline.id",
    "phone": "+6282110000010",
    "province": "Kalimantan Barat",
    "kabupaten": "Kabupaten Melawi",
    "kecamatan": "Kecamatan Melawi",
    "latitude": -0.656,
    "longitude": 111.7679,
    "avatarUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Wahyu Setiawan (Kayong Utara)",
    "username": "relawan_kayong_utara",
    "email": "relawan.kayong_utara@fireline.id",
    "phone": "+6282110000011",
    "province": "Kalimantan Barat",
    "kabupaten": "Kabupaten Kayong Utara",
    "kecamatan": "Kecamatan Kayong Utara",
    "latitude": -1.2843,
    "longitude": 109.4465,
    "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Aditya Nugraha (Kubu Raya)",
    "username": "relawan_kubu_raya",
    "email": "relawan.kubu_raya@fireline.id",
    "phone": "+6282110000012",
    "province": "Kalimantan Barat",
    "kabupaten": "Kabupaten Kubu Raya",
    "kecamatan": "Kecamatan Kubu Raya",
    "latitude": -0.4571,
    "longitude": 109.484,
    "avatarUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Yusuf Maulana (Kota Pontianak)",
    "username": "relawan_pontianak",
    "email": "relawan.pontianak@fireline.id",
    "phone": "+6282110000013",
    "province": "Kalimantan Barat",
    "kabupaten": "Kota Pontianak",
    "kecamatan": "Kecamatan Pontianak Kota",
    "latitude": -0.0249,
    "longitude": 109.338,
    "avatarUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Doni Kusuma (Kota Singkawang)",
    "username": "relawan_singkawang",
    "email": "relawan.singkawang@fireline.id",
    "phone": "+6282110000014",
    "province": "Kalimantan Barat",
    "kabupaten": "Kota Singkawang",
    "kecamatan": "Kecamatan Singkawang Kota",
    "latitude": 0.9137,
    "longitude": 109.06,
    "avatarUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Ilham Firmansyah (Kotawaringin Barat)",
    "username": "relawan_kotawaringin_barat",
    "email": "relawan.kotawaringin_barat@fireline.id",
    "phone": "+6282110000015",
    "province": "Kalimantan Tengah",
    "kabupaten": "Kabupaten Kotawaringin Barat",
    "kecamatan": "Kecamatan Kotawaringin Barat",
    "latitude": -2.6221,
    "longitude": 111.6962,
    "avatarUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Gilang Perkasa (Kotawaringin Timur)",
    "username": "relawan_kotawaringin_timur",
    "email": "relawan.kotawaringin_timur@fireline.id",
    "phone": "+6282110000016",
    "province": "Kalimantan Tengah",
    "kabupaten": "Kabupaten Kotawaringin Timur",
    "kecamatan": "Kecamatan Kotawaringin Timur",
    "latitude": -2.3687,
    "longitude": 112.7935,
    "avatarUrl": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Bambang Wijaya (Kapuas)",
    "username": "relawan_kapuas",
    "email": "relawan.kapuas@fireline.id",
    "phone": "+6282110000017",
    "province": "Kalimantan Tengah",
    "kabupaten": "Kabupaten Kapuas",
    "kecamatan": "Kecamatan Kapuas",
    "latitude": -2.1414,
    "longitude": 114.3299,
    "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Agus Susanto (Barito Selatan)",
    "username": "relawan_barito_selatan",
    "email": "relawan.barito_selatan@fireline.id",
    "phone": "+6282110000018",
    "province": "Kalimantan Tengah",
    "kabupaten": "Kabupaten Barito Selatan",
    "kecamatan": "Kecamatan Barito Selatan",
    "latitude": -1.9972,
    "longitude": 114.9269,
    "avatarUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Tri Haryanto (Barito Utara)",
    "username": "relawan_barito_utara",
    "email": "relawan.barito_utara@fireline.id",
    "phone": "+6282110000019",
    "province": "Kalimantan Tengah",
    "kabupaten": "Kabupaten Barito Utara",
    "kecamatan": "Kecamatan Barito Utara",
    "latitude": -0.7124,
    "longitude": 115.3259,
    "avatarUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Bagus Wira (Sukamara)",
    "username": "relawan_sukamara",
    "email": "relawan.sukamara@fireline.id",
    "phone": "+6282110000020",
    "province": "Kalimantan Tengah",
    "kabupaten": "Kabupaten Sukamara",
    "kecamatan": "Kecamatan Sukamara",
    "latitude": -2.628,
    "longitude": 111.1026,
    "avatarUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Imam Safei (Lamandau)",
    "username": "relawan_lamandau",
    "email": "relawan.lamandau@fireline.id",
    "phone": "+6282110000021",
    "province": "Kalimantan Tengah",
    "kabupaten": "Kabupaten Lamandau",
    "kecamatan": "Kecamatan Lamandau",
    "latitude": -1.7927,
    "longitude": 111.1943,
    "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Satria Dewa (Seruyan)",
    "username": "relawan_seruyan",
    "email": "relawan.seruyan@fireline.id",
    "phone": "+6282110000022",
    "province": "Kalimantan Tengah",
    "kabupaten": "Kabupaten Seruyan",
    "kecamatan": "Kecamatan Seruyan",
    "latitude": -2.0055,
    "longitude": 112.0819,
    "avatarUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Panji Asmoro (Katingan)",
    "username": "relawan_katingan",
    "email": "relawan.katingan@fireline.id",
    "phone": "+6282110000023",
    "province": "Kalimantan Tengah",
    "kabupaten": "Kabupaten Katingan",
    "kecamatan": "Kecamatan Katingan",
    "latitude": -1.6548,
    "longitude": 113.0079,
    "avatarUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Danang Joyo (Pulang Pisau)",
    "username": "relawan_pulang_pisau",
    "email": "relawan.pulang_pisau@fireline.id",
    "phone": "+6282110000024",
    "province": "Kalimantan Tengah",
    "kabupaten": "Kabupaten Pulang Pisau",
    "kecamatan": "Kecamatan Pulang Pisau",
    "latitude": -2.7275,
    "longitude": 113.9502,
    "avatarUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Surya Gemilang (Gunung Mas)",
    "username": "relawan_gunung_mas",
    "email": "relawan.gunung_mas@fireline.id",
    "phone": "+6282110000025",
    "province": "Kalimantan Tengah",
    "kabupaten": "Kabupaten Gunung Mas",
    "kecamatan": "Kecamatan Gunung Mas",
    "latitude": -1.0199,
    "longitude": 113.5749,
    "avatarUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Taufik Rahman (Barito Timur)",
    "username": "relawan_barito_timur",
    "email": "relawan.barito_timur@fireline.id",
    "phone": "+6282110000026",
    "province": "Kalimantan Tengah",
    "kabupaten": "Kabupaten Barito Timur",
    "kecamatan": "Kecamatan Barito Timur",
    "latitude": -1.9486,
    "longitude": 115.2738,
    "avatarUrl": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Randi Syahputra (Murung Raya)",
    "username": "relawan_murung_raya",
    "email": "relawan.murung_raya@fireline.id",
    "phone": "+6282110000027",
    "province": "Kalimantan Tengah",
    "kabupaten": "Kabupaten Murung Raya",
    "kecamatan": "Kecamatan Murung Raya",
    "latitude": 0.2337,
    "longitude": 114.2692,
    "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Galih Wicaksono (Kotabaru)",
    "username": "relawan_kotabaru",
    "email": "relawan.kotabaru@fireline.id",
    "phone": "+6282110000028",
    "province": "Kalimantan Selatan",
    "kabupaten": "Kabupaten Kotabaru",
    "kecamatan": "Kecamatan Kotabaru",
    "latitude": -3.1991,
    "longitude": 116.1305,
    "avatarUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Faisal Tanjung (Banjar)",
    "username": "relawan_banjar",
    "email": "relawan.banjar@fireline.id",
    "phone": "+6282110000029",
    "province": "Kalimantan Selatan",
    "kabupaten": "Kabupaten Banjar",
    "kecamatan": "Kecamatan Banjar",
    "latitude": -3.2803,
    "longitude": 115.0714,
    "avatarUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Haris Setiadi (Barito Kuala)",
    "username": "relawan_barito_kuala",
    "email": "relawan.barito_kuala@fireline.id",
    "phone": "+6282110000030",
    "province": "Kalimantan Selatan",
    "kabupaten": "Kabupaten Barito Kuala",
    "kecamatan": "Kecamatan Barito Kuala",
    "latitude": -3.1192,
    "longitude": 114.6059,
    "avatarUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Hadi Sucipto (Tapin)",
    "username": "relawan_tapin",
    "email": "relawan.tapin@fireline.id",
    "phone": "+6282110000031",
    "province": "Kalimantan Selatan",
    "kabupaten": "Kabupaten Tapin",
    "kecamatan": "Kecamatan Tapin",
    "latitude": -2.9416,
    "longitude": 115.2056,
    "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Ivan Gunadi (Hulu Sungai Selatan)",
    "username": "relawan_hulu_sungai_selatan",
    "email": "relawan.hulu_sungai_selatan@fireline.id",
    "phone": "+6282110000032",
    "province": "Kalimantan Selatan",
    "kabupaten": "Kabupaten Hulu Sungai Selatan",
    "kecamatan": "Kecamatan Hulu Sungai Selatan",
    "latitude": -2.7611,
    "longitude": 115.2806,
    "avatarUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Lukman Hakim (Hulu Sungai Tengah)",
    "username": "relawan_hulu_sungai_tengah",
    "email": "relawan.hulu_sungai_tengah@fireline.id",
    "phone": "+6282110000033",
    "province": "Kalimantan Selatan",
    "kabupaten": "Kabupaten Hulu Sungai Tengah",
    "kecamatan": "Kecamatan Hulu Sungai Tengah",
    "latitude": -2.616,
    "longitude": 115.5056,
    "avatarUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Mahendra Putra (Hulu Sungai Utara)",
    "username": "relawan_hulu_sungai_utara",
    "email": "relawan.hulu_sungai_utara@fireline.id",
    "phone": "+6282110000034",
    "province": "Kalimantan Selatan",
    "kabupaten": "Kabupaten Hulu Sungai Utara",
    "kecamatan": "Kecamatan Hulu Sungai Utara",
    "latitude": -2.4469,
    "longitude": 115.1738,
    "avatarUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Nanda Pradipta (Tabalong)",
    "username": "relawan_tabalong",
    "email": "relawan.tabalong@fireline.id",
    "phone": "+6282110000035",
    "province": "Kalimantan Selatan",
    "kabupaten": "Kabupaten Tabalong",
    "kecamatan": "Kecamatan Tabalong",
    "latitude": -1.8381,
    "longitude": 115.5121,
    "avatarUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Oki Setiawan (Tanah Bumbu)",
    "username": "relawan_tanah_bumbu",
    "email": "relawan.tanah_bumbu@fireline.id",
    "phone": "+6282110000036",
    "province": "Kalimantan Selatan",
    "kabupaten": "Kabupaten Tanah Bumbu",
    "kecamatan": "Kecamatan Tanah Bumbu",
    "latitude": -3.3721,
    "longitude": 115.7401,
    "avatarUrl": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Purna Irawan (Balangan)",
    "username": "relawan_balangan",
    "email": "relawan.balangan@fireline.id",
    "phone": "+6282110000037",
    "province": "Kalimantan Selatan",
    "kabupaten": "Kabupaten Balangan",
    "kecamatan": "Kecamatan Balangan",
    "latitude": -2.279,
    "longitude": 115.6749,
    "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Raden Mas Bagus (Kota Banjarmasin)",
    "username": "relawan_banjarmasin",
    "email": "relawan.banjarmasin@fireline.id",
    "phone": "+6282110000038",
    "province": "Kalimantan Selatan",
    "kabupaten": "Kota Banjarmasin",
    "kecamatan": "Kecamatan Banjarmasin Kota",
    "latitude": -3.324,
    "longitude": 114.5967,
    "avatarUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Sigit Purnomo (Kota Banjarbaru)",
    "username": "relawan_banjarbaru",
    "email": "relawan.banjarbaru@fireline.id",
    "phone": "+6282110000039",
    "province": "Kalimantan Selatan",
    "kabupaten": "Kota Banjarbaru",
    "kecamatan": "Kecamatan Banjarbaru Kota",
    "latitude": -3.4977,
    "longitude": 114.8418,
    "avatarUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Teguh Raharjo (Paser)",
    "username": "relawan_paser",
    "email": "relawan.paser@fireline.id",
    "phone": "+6282110000040",
    "province": "Kalimantan Timur",
    "kabupaten": "Kabupaten Paser",
    "kecamatan": "Kecamatan Paser",
    "latitude": -1.7795,
    "longitude": 115.9954,
    "avatarUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Untung Surapati (Kutai Barat)",
    "username": "relawan_kutai_barat",
    "email": "relawan.kutai_barat@fireline.id",
    "phone": "+6282110000041",
    "province": "Kalimantan Timur",
    "kabupaten": "Kabupaten Kutai Barat",
    "kecamatan": "Kecamatan Kutai Barat",
    "latitude": -0.5085,
    "longitude": 115.7466,
    "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Victor Simanjuntak (Kutai Kartanegara)",
    "username": "relawan_kutai_kartanegara",
    "email": "relawan.kutai_kartanegara@fireline.id",
    "phone": "+6282110000042",
    "province": "Kalimantan Timur",
    "kabupaten": "Kabupaten Kutai Kartanegara",
    "kecamatan": "Kecamatan Kutai Kartanegara",
    "latitude": -0.4539,
    "longitude": 117.2246,
    "avatarUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Wawan Darmawan (Kutai Timur)",
    "username": "relawan_kutai_timur",
    "email": "relawan.kutai_timur@fireline.id",
    "phone": "+6282110000043",
    "province": "Kalimantan Timur",
    "kabupaten": "Kabupaten Kutai Timur",
    "kecamatan": "Kecamatan Kutai Timur",
    "latitude": 0.8609,
    "longitude": 117.5423,
    "avatarUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Yoga Pratama (Berau)",
    "username": "relawan_berau",
    "email": "relawan.berau@fireline.id",
    "phone": "+6282110000044",
    "province": "Kalimantan Timur",
    "kabupaten": "Kabupaten Berau",
    "kecamatan": "Kecamatan Berau",
    "latitude": 1.8734,
    "longitude": 117.9724,
    "avatarUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Zainal Abidin (Penajam Paser Utara)",
    "username": "relawan_penajam_paser_utara",
    "email": "relawan.penajam_paser_utara@fireline.id",
    "phone": "+6282110000045",
    "province": "Kalimantan Timur",
    "kabupaten": "Kabupaten Penajam Paser Utara",
    "kecamatan": "Kecamatan Penajam Paser Utara",
    "latitude": -1.0826,
    "longitude": 116.7074,
    "avatarUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Alif Nur Prasetya (Mahakam Hulu)",
    "username": "relawan_mahakam_hulu",
    "email": "relawan.mahakam_hulu@fireline.id",
    "phone": "+6282110000046",
    "province": "Kalimantan Timur",
    "kabupaten": "Kabupaten Mahakam Hulu",
    "kecamatan": "Kecamatan Mahakam Hulu",
    "latitude": 0.7286,
    "longitude": 114.7471,
    "avatarUrl": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Bobby Andika (Kota Balikpapan)",
    "username": "relawan_balikpapan",
    "email": "relawan.balikpapan@fireline.id",
    "phone": "+6282110000047",
    "province": "Kalimantan Timur",
    "kabupaten": "Kota Balikpapan",
    "kecamatan": "Kecamatan Balikpapan Kota",
    "latitude": -1.1151,
    "longitude": 116.8368,
    "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Chandra Kirana (Kota Samarinda)",
    "username": "relawan_samarinda",
    "email": "relawan.samarinda@fireline.id",
    "phone": "+6282110000048",
    "province": "Kalimantan Timur",
    "kabupaten": "Kota Samarinda",
    "kecamatan": "Kecamatan Samarinda Kota",
    "latitude": -0.5203,
    "longitude": 117.1965,
    "avatarUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Dicky Darmawan (Kota Bontang)",
    "username": "relawan_bontang",
    "email": "relawan.bontang@fireline.id",
    "phone": "+6282110000049",
    "province": "Kalimantan Timur",
    "kabupaten": "Kota Bontang",
    "kecamatan": "Kecamatan Bontang Kota",
    "latitude": 0.1041,
    "longitude": 117.4899,
    "avatarUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Endra Kusuma (Malinau)",
    "username": "relawan_malinau",
    "email": "relawan.malinau@fireline.id",
    "phone": "+6282110000050",
    "province": "Kalimantan Utara",
    "kabupaten": "Kabupaten Malinau",
    "kecamatan": "Kecamatan Malinau",
    "latitude": 2.5631,
    "longitude": 115.5315,
    "avatarUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Ferry Irawan (Bulungan)",
    "username": "relawan_bulungan",
    "email": "relawan.bulungan@fireline.id",
    "phone": "+6282110000051",
    "province": "Kalimantan Utara",
    "kabupaten": "Kabupaten Bulungan",
    "kecamatan": "Kecamatan Bulungan",
    "latitude": 2.988,
    "longitude": 117.3623,
    "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Guntur Alam (Tana Tidung)",
    "username": "relawan_tana_tidung",
    "email": "relawan.tana_tidung@fireline.id",
    "phone": "+6282110000052",
    "province": "Kalimantan Utara",
    "kabupaten": "Kabupaten Tana Tidung",
    "kecamatan": "Kecamatan Tana Tidung",
    "latitude": 3.5642,
    "longitude": 117.3057,
    "avatarUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Heri Cahyono (Nunukan)",
    "username": "relawan_nunukan",
    "email": "relawan.nunukan@fireline.id",
    "phone": "+6282110000053",
    "province": "Kalimantan Utara",
    "kabupaten": "Kabupaten Nunukan",
    "kecamatan": "Kecamatan Nunukan",
    "latitude": 4.0038,
    "longitude": 116.9148,
    "avatarUrl": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Indra Lesmana (Kota Tarakan)",
    "username": "relawan_tarakan",
    "email": "relawan.tarakan@fireline.id",
    "phone": "+6282110000054",
    "province": "Kalimantan Utara",
    "kabupaten": "Kota Tarakan",
    "kecamatan": "Kecamatan Tarakan Kota",
    "latitude": 3.3543,
    "longitude": 117.5967,
    "avatarUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Joko Priyono (Kota Palangka Raya)",
    "username": "relawan_palangka_raya",
    "email": "relawan.palangka_raya@fireline.id",
    "phone": "+6282110000055",
    "province": "Kalimantan Tengah",
    "kabupaten": "Kota Palangka Raya",
    "kecamatan": "Kecamatan Palangka Raya Kota",
    "latitude": -1.9772,
    "longitude": 113.778,
    "avatarUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80"
  },
  {
    "name": "Kurnia Sandi (Tanah Laut)",
    "username": "relawan_tanah_laut",
    "email": "relawan.tanah_laut@fireline.id",
    "phone": "+6282110000056",
    "province": "Kalimantan Selatan",
    "kabupaten": "Kabupaten Tanah Laut",
    "kecamatan": "Kecamatan Tanah Laut",
    "latitude": -3.7752,
    "longitude": 114.8936,
    "avatarUrl": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80"
  }
];

async function main() {
  console.log('====================================================');
  console.log('Memulai seeding 56 Relawan untuk seluruh Kabupaten/Kota di Kalimantan...');
  console.log('====================================================');

  const defaultPasswordHash = await bcrypt.hash('Relawan123!', 10);

  let successCount = 0;

  for (const v of volunteersData) {
    const user = await prisma.user.upsert({
      where: { username: v.username },
      update: {
        name: v.name,
        email: v.email,
        phone: v.phone,
        role: Role.RELAWAN,
        province: v.province,
        kabupaten: v.kabupaten,
        kecamatan: v.kecamatan,
        latitude: v.latitude,
        longitude: v.longitude,
        avatarUrl: v.avatarUrl,
        isAvailable: true,
      },
      create: {
        name: v.name,
        username: v.username,
        email: v.email,
        phone: v.phone,
        password: defaultPasswordHash,
        role: Role.RELAWAN,
        province: v.province,
        kabupaten: v.kabupaten,
        kecamatan: v.kecamatan,
        latitude: v.latitude,
        longitude: v.longitude,
        avatarUrl: v.avatarUrl,
        isAvailable: true,
      },
    });

    successCount++;
    console.log(`[${successCount}/56] OK: ${user.name} (@${user.username}) -> ${user.kabupaten}, ${user.province}`);
  }

  console.log('====================================================');
  console.log(`SUKSES! ${successCount} Akun Relawan terdaftar di 56 Kabupaten/Kota se-Kalimantan.`);
  console.log('Semua akun berstatus isAvailable: true (siap ditugaskan admin posko).');
  console.log('Password login: Relawan123!');
  console.log('====================================================');
}

main()
  .catch((e) => {
    console.error('Error saat seeding relawan:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
