# FIREZONE Core Backend (NestJS + PostgreSQL + Prisma + Docker)

Backend inti untuk platform **FIREZONE** (WIA MIA 2026), mengimplementasikan seluruh alur desain Figma, sistem autentikasi 3 peran (*Warga, Relawan, Admin*), pelaporan titik api komunitas, penugasan relawan lapangan, notifikasi darurat, data panggilan darurat, dan otomatisasi sinkronisasi data satelit NASA FIRMS.

---

## Kebijakan Keamanan Kata Sandi (Password Policy)

Sesuai standar keamanan sistem modern dan format registrasi:
* **Panjang Minimal:** 8 Karakter
* **Komposisi Wajib:**
  1. Minimal 1 huruf besar (`A-Z`)
  2. Minimal 1 huruf kecil (`a-z`)
  3. Minimal 1 angka (`0-9`)
  4. Minimal 1 karakter unik / simbol khusus (`!@#$%^&*()_+-=[]{};':"|,.<>/?`)
* **Contoh Valid:** `Admin123!`, `Sarah123!`, `Rangga123!`

---

## Akun Demo Seed Terverifikasi (Database Fresh)

Database PostgreSQL telah dibersihkan secara total (*clean slate*) dan diisi ulang (*re-seeded*) dengan kredensial berikut:

| Peran | Nama | Email | Kata Sandi | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| **Warga** | Sarah Wijiyatno | `sarahwijiyatno@gmail.com` | `Sarah123!` | Tokoh utama di layar Profil & Beranda Warga |
| **Warga** | Rina | `rina.warga@gmail.com` | `Rina123!` | Pelapor kebakaran darurat di Desa Bancoh |
| **Relawan** | Rangga Wicaksono | `rangga.relawan@gmail.com` | `Rangga123!` | Petugas lapangan yang ditugaskan ke Desa Bancoh |
| **Admin** | Koordinator Posko BPBD | `admin.posko@fireline.id` | `Admin123!` | Hak akses penuh dispatch & verifikasi posko |

---

## Otomatisasi Pembaruan Data Satelit (Setiap 3 Jam)

Modul **`AppSchedulerModule`** menjalankan cron job otomatis di latar belakang:
* **Jadwal Otomatis:** Setiap 3 jam pada **`01.00, 04.00, 07.00, 10.00, 13.00, 16.00, 19.00, 22.00 WIB`**.
  * Sesuai dengan latensi pemrosesan downlink satelit VIIRS NASA FIRMS (~3 jam) dan label pembaharuan di mockup Figma (*"Terakhir diperbarui 01.00 WIB"*).
* **Manual Trigger On-Demand:**
  * Admin Posko dapat memicu sinkronisasi manual kapan saja melalui:
    `POST /sync/trigger` (Header: `Authorization: Bearer <ADMIN_TOKEN>`)
  * Status sinkronisasi dapat dipantau di:
    `GET /sync/status`

---

## Cara Menjalankan dengan Docker

Cukup jalankan satu perintah dari folder `fireline_web`:
```bash
docker compose up -d
```
Ini akan otomatis menyalakan:
1. **`fireline_postgres`** (PostgreSQL 16) pada port `5432`.
2. **`fireline_backend`** (NestJS) pada port `3000`.

---

## Cara Menjalankan Secara Lokal (Development)

### 1. Nyalakan Database PostgreSQL saja:
```bash
docker compose up -d postgres
```

### 2. Reset & Seed Ulang Database Bersih:
```bash
cd backend
npx prisma db push
npx tsx prisma/seed.ts
```

### 3. Jalankan Server NestJS:
```bash
npm run start:dev
```
Server akan aktif di: **`http://localhost:3000`**  
Dokumentasi interaktif Swagger UI (Lokal): **`http://localhost:3000/api/docs`**  
Dokumentasi interaktif Swagger UI (Production): [**`https://prevhutweb-production.up.railway.app/api/docs`**](https://prevhutweb-production.up.railway.app/api/docs)  
Dokumentasi FastAPI Data Service (Production): [**`https://prevhut-production.up.railway.app/docs`**](https://prevhut-production.up.railway.app/docs)

---

## Rangkuman Endpoint API Sesuai Mockup Figma

### 1. Autentikasi (`/auth`)
* `POST /auth/register` — Registrasi akun (alur multi-step: Warga/Relawan, domisili GPS, validasi kata sandi kuat).
* `POST /auth/login` — Masuk dengan email & kata sandi (mengembalikan token JWT).
* `GET /auth/me` — Info akun aktif dari token Bearer.

### 2. Profil & Aktivitas (`/users`)
* `GET /users/profile` — Layar profil Sarah (avatar, peran, toggle GPS).
* `PATCH /users/profile` — Edit profil & pengaturan GPS.
* `GET /users/activities` — Tab "Aktivitas Saya" (Postingan, Komentar, Laporan Saya).
* `GET /users/volunteers` — *(Admin Only)* Daftar relawan yang siap ditugaskan.

### 3. Komunitas & Laporan Warga (`/community`)
* `GET /community/posts` — Feed postingan (filter: `category=DARURAT`, wilayah, status).
* `GET /community/posts/:id` — Detail postingan + Update Pengirim + Balasan Komentar.
* `POST /community/posts` — Form lapor darurat (simulasi kamera HP live & alamat GPS).
* `POST /community/posts/:id/updates` — Tambah kabar progres terkini dari lokasi kejadian (*Update Pengirim*).
* `POST /community/posts/:id/comments` — Diskusi warga & relawan.
* `POST /community/posts/:id/flag` — Laporkan postingan hoax/salah lokasi ke Admin.

### 4. Penugasan Relawan Lapangan (`/assignments`)
* `POST /assignments` — *(Admin Only)* Tugaskan relawan ke area pantau / laporan warga.
* `GET /assignments` — *(Admin Only)* Monitor seluruh penugasan lapangan.
* `GET /assignments/my-tasks` — *(Relawan)* Lihat daftar tugas saya.
* `PATCH /assignments/:id/status` — *(Relawan)* Update alur penanganan: `ACCEPTED` → `ON_THE_WAY` → `ON_SITE` → `COMPLETED`.
* `POST /assignments/:id/reject` — *(Relawan)* Tolak tugas disertai alasan.
* `POST /assignments/:id/verify` — *(Relawan)* Upload foto bukti & koordinat GPS pemadaman.

### 5. Panggilan Darurat & Evakuasi (`/emergency`)
* `GET /emergency/contacts` — Daftar nomor darurat (Damkar 113, SAR 115, Polisi 110, Ambulans 119).
* `GET /emergency/protocol` — 5 langkah protokol evakuasi cepat.

### 6. Notifikasi (`/notifications`)
* `GET /notifications` — Riwayat notifikasi (Hari Ini & Sebelumnya).
* `PATCH /notifications/:id/read` — Tandai telah dibaca.

### 7. Otomasi & Sinkronisasi (`/sync`)
* `GET /sync/status` — Status sinkronisasi terakhir & interval 3 jam.
* `POST /sync/trigger` — *(Admin Only)* Trigger sinkronisasi manual live on-demand.
