import express, { json, urlencoded } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

    // Serve static uploaded files with HTTP Range-Request support for video playback
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use("/uploads", express.static(uploadsDir, {
    setHeaders: (res) => {
      res.setHeader("Accept-Ranges", "bytes");
    }
  }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      stopAtFirstError: false,
    }),
  );

  // Setup rich Swagger OpenAPI documentation
  const swaggerDescription = `
### Platform FIRELINE: Early Hazard Intelligence & Civic Transparency (WIA MIA 2026)

REST API microservice inti untuk manajemen pengguna multi-peran, pelaporan titik api komunitas (*civic reporting*), penugasan relawan lapangan (*field dispatch*), moderasi konten & anti-hoax (*civic transparency*), pusat manajemen insiden karhutla, panggilan darurat, dan sinkronisasi satelit NASA FIRMS.

---

### Akun Demo Cepat (Tinggal Copy-Paste untuk Menguji API):

| Peran | Email | Kata Sandi | Kegunaan Uji Coba di Swagger |
| :--- | :--- | :--- | :--- |
| **ADMIN** | \`admin.posko@fireline.id\` | \`Admin123!\` | Menguji fitur dispatch relawan, moderasi laporan hoax, manajemen insiden terpadu, trigger sync live satelit |
| **RELAWAN** | \`rangga.relawan@gmail.com\` | \`Rangga123!\` | Menguji terima/tolak tugas, update status penanganan lapangan, upload bukti verifikasi tuntas |
| **WARGA** | \`sarahwijiyatno@gmail.com\` | \`Sarah123!\` | Menguji buat laporan darurat kamera live, edit profil, laporkan postingan hoax |
| **WARGA 2** | \`rina.warga@gmail.com\` | \`Rina123!\` | Pelapor insiden kebakaran darurat Desa Bancoh |

---

### Alur Moderasi Konten & Verifikasi Hoax (Khusus Admin Posko):
1. **Lapor Hoax oleh Warga:** Endpoint \`POST /community/posts/:id/flag\` menerima aduan dari warga dengan alasan: \`FOTO_LOKASI_TIDAK_SESUAI\`, \`BERITA_BOHONG_HOAX\`, \`UJARAN_KEBENCIAN_ATAU_SARA\`, atau \`SPAM_IKLAN\`.
2. **Review oleh Admin Posko:** Endpoint \`GET /community/reports\` dan \`GET /community/reports/stats\` menampilkan riwayat akun-akun pelapor, alasan aduan, serta status review.
3. **Tindakan Admin Posko:** Endpoint \`POST /community/posts/:id/moderate\` mengeksekusi aksi:
   * \`REJECT_HOAX\`: Mengonfirmasi postingan adalah hoax/palsu dan **mereset skor risiko konfirmasi warga menjadi 0** agar kalkulasi risiko bahaya kembali akurat.
   * \`APPROVE_VALID\`: Menyatakan postingan sah/valid dan menutup seluruh aduan terkait.
   * \`DELETE_POST\`: Menghapus postingan palsu dan aduannya secara permanen dari basis data.

---

### Manajemen Insiden Terpadu (*Incident Grouping*):
* Endpoint \`GET /community/incidents\`: Mengelompokkan seluruh laporan darurat warga di area atau desa yang sama ke dalam satu kelompok insiden. Menugaskan relawan ke satu insiden otomatis memperbarui seluruh laporan warga terkait.

---

### Kebijakan Validasi Kata Sandi (Password Policy):
Setiap pendaftaran kata sandi baru **wajib** memenuhi:
* Minimal **8 karakter**.
* Mengandung minimal **1 huruf besar** (\`A-Z\`).
* Mengandung minimal **1 huruf kecil** (\`a-z\`).
* Mengandung minimal **1 angka** (\`0-9\`).
* Mengandung minimal **1 karakter unik/simbol** (\`!@#$%^&*()_+-=[]{};':"|,.<>/?\`).
* *Contoh valid:* \`Admin123!\`, \`Sarah123!\`, \`Rangga123!\`.

---

### Siklus Otomasi Sinkronisasi Satelit NASA FIRMS:
* **Cron Otomatis:** Berjalan di latar belakang **setiap 3 jam** (\`01.00, 04.00, 07.00, 10.00, 13.00, 16.00, 19.00, 22.00 WIB\`).
* **On-Demand:** Admin dapat memicu penarikan data kapan saja melalui endpoint \`POST /sync/trigger\`.
`;

  const config = new DocumentBuilder()
    .setTitle('FIRELINE Core API Documentation')
    .setDescription(swaggerDescription)
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Masukkan Token JWT (didapat dari response POST /auth/login)',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('1. Autentikasi (Auth)', 'Registrasi multi-step, Login dengan validasi password kuat, Cek sesi JWT aktif')
    .addTag('2. Profil & Pengguna (Users)', 'Layar profil, edit data diri, toggle GPS selalu aktif, Aktivitas Saya, dan daftar relawan')
    .addTag('3. Komunitas & Laporan Warga (Community)', 'Feed postingan darurat/informasi, simulasi kamera live & GPS, update pengirim, komentar, aduan hoax warga, cluster insiden, dan moderasi posko')
    .addTag('4. Penugasan Relawan Lapangan (Assignments)', 'Sistem dispatch penugasan dari Admin Posko, pembaruan status lapangan, tolak tugas, dan upload verifikasi')
    .addTag('5. Panggilan Darurat & Evakuasi (Emergency)', 'Nomor darurat Damkar 113, SAR 115, Polisi 110, Ambulans 119, dan 5 langkah evakuasi cepat')
    .addTag('6. Pusat Notifikasi (Notifications)', 'Riwayat notifikasi bahaya P1 & pembaruan tugas dikelompokkan Hari Ini dan Sebelumnya')
    .addTag('7. Otomasi Satelit & Sinkronisasi (Sync)', 'Status jadwal cron 3 jam dan tombol pembaruan data NASA FIRMS on-demand untuk Admin')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'FIRELINE API Docs (Swagger UI)',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🔥 FIRELINE Core Backend running on http://localhost:${port}`);
  console.log(`📖 Swagger API documentation available at http://localhost:${port}/api/docs`);
}
await bootstrap();
