import { PrismaClient, Role, PostCategory, PostStatus, PriorityLevel, AssignmentStatus, NotificationType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding PostgreSQL database...');

  await prisma.notification.deleteMany();
  await prisma.volunteerAssignment.deleteMany();
  await prisma.postReport.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.postUpdate.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  await prisma.emergencyContact.deleteMany();

  console.log('Database bersih! Memulai seeding data baru dengan password aman (kombinasi unik & min 8 karakter)...');

  // Hash individual secure passwords
  const passwordSarah = await bcrypt.hash('Sarah123!', 10);
  const passwordRina = await bcrypt.hash('Rina123!', 10);
  const passwordRangga = await bcrypt.hash('Rangga123!', 10);
  const passwordAdmin = await bcrypt.hash('Admin123!', 10);

  // 2. Create Users (Warga, Relawan, Admin)
  const sarah = await prisma.user.create({
    data: {
      name: 'Sarah Wijiyatno',
      username: 'sarahwijiyatno',
      phone: '+6281234567890',
      email: 'sarahwijiyatno@gmail.com',
      password: passwordSarah,
      role: Role.WARGA,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      province: 'Kalimantan Barat',
      kabupaten: 'Kabupaten Sintang',
      kecamatan: 'Kecamatan Sintang',
      latitude: -0.0712,
      longitude: 111.4981,
    },
  });

  const rina = await prisma.user.create({
    data: {
      name: 'Rina',
      username: 'rinawarga',
      phone: '+6281298765432',
      email: 'rina.warga@gmail.com',
      password: passwordRina,
      role: Role.WARGA,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
      province: 'Kalimantan Barat',
      kabupaten: 'Kabupaten Sintang',
      kecamatan: 'Kecamatan Sungai Tebelian',
      latitude: -0.125,
      longitude: 111.482,
    },
  });

  const rangga = await prisma.user.create({
    data: {
      name: 'Rangga Wicaksono',
      username: 'ranggawicaksono',
      phone: '+6281355558888',
      email: 'rangga.relawan@gmail.com',
      password: passwordRangga,
      role: Role.RELAWAN,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      province: 'Kalimantan Barat',
      kabupaten: 'Kabupaten Sintang',
      kecamatan: 'Kecamatan Sungai Tebelian',
      latitude: -0.118,
      longitude: 111.479,
      isAvailable: true,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Koordinator Posko BPBD Sintang',
      username: 'adminposko',
      phone: '+6281100009999',
      email: 'admin.posko@fireline.id',
      password: passwordAdmin,
      role: Role.ADMIN,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      province: 'Kalimantan Barat',
      kabupaten: 'Kabupaten Sintang',
      kecamatan: 'Kecamatan Sintang',
      latitude: -0.065,
      longitude: 111.502,
    },
  });

  console.log(`Users dibuat:`);
  console.log(`   - Sarah (WARGA): @sarahwijiyatno (sarahwijiyatno@gmail.com) / Sarah123!`);
  console.log(`   - Rina (WARGA): @rinawarga (rina.warga@gmail.com) / Rina123!`);
  console.log(`   - Rangga (RELAWAN): @ranggawicaksono (rangga.relawan@gmail.com) / Rangga123!`);
  console.log(`   - Admin (ADMIN): @adminposko (admin.posko@fireline.id) / Admin123!`);

  // 3. Create Posts (Geographically coherent with NASA FIRMS clusters)
  // Area Pantau 02: Kabupaten Kapuas, Kalimantan Tengah
  const emergencyPost = await prisma.post.create({
    data: {
      authorId: rina.id,
      category: PostCategory.DARURAT,
      content: 'Terlihat asap tebal dan kobaran api di lahan gambut pinggir jalan Basarang, mengarah ke kebun karet warga. Jarak pandang menurun drastis.',
      imageUrl: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=800&q=80',
      isLiveCamera: true,
      address: 'Jl. Trans Kalimantan Km 14, Kec. Basarang, Kab. Kapuas, Kalimantan Tengah',
      province: 'Kalimantan Tengah',
      kabupaten: 'Kabupaten Kapuas',
      kecamatan: 'Kecamatan Basarang',
      latitude: -2.4920,
      longitude: 114.3610,
      status: PostStatus.DALAM_PENANGANAN,
      clusterCode: 'Area Pantau 02',
    },
  });

  // Area Pantau 01: Kabupaten Seruyan, Kalimantan Tengah
  const seruyanPost = await prisma.post.create({
    data: {
      authorId: sarah.id,
      category: PostCategory.DARURAT,
      content: 'Kepulan asap pekat terdeteksi di semak belukar dekat batas perkebunan kelapa sawit warga. Bau sangit mulai masuk ke permukiman.',
      imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
      isLiveCamera: true,
      address: 'Desa Pembuang Hulu, Kec. Hanau, Kab. Seruyan, Kalimantan Tengah',
      province: 'Kalimantan Tengah',
      kabupaten: 'Kabupaten Seruyan',
      kecamatan: 'Kecamatan Hanau',
      latitude: -3.2750,
      longitude: 112.0550,
      status: PostStatus.MENUNGGU_VERIFIKASI,
      clusterCode: 'Area Pantau 01',
    },
  });

  // Laporan lokal mandiri warga: Kabupaten Sintang, Kalimantan Barat (Tanpa clusterCode satelit)
  const infoPost = await prisma.post.create({
    data: {
      authorId: sarah.id,
      category: PostCategory.INFORMASI,
      content: 'Pagi ini masih terlihat kabut asap tipis di sekitar permukiman kota Sintang. Jarak pandang aman sekitar 1 km, gunakan masker jika keluar rumah.',
      imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
      isLiveCamera: true,
      address: 'Jl. Ahmad Yani, Kec. Sintang, Kab. Sintang, Kalimantan Barat',
      province: 'Kalimantan Barat',
      kabupaten: 'Kabupaten Sintang',
      kecamatan: 'Kecamatan Sintang',
      latitude: -0.0712,
      longitude: 111.4981,
      status: PostStatus.MENUNGGU_VERIFIKASI,
      clusterCode: null,
    },
  });

  // 4. Create Post Updates ("Update Pengirim")
  await prisma.postUpdate.create({
    data: {
      postId: emergencyPost.id,
      authorId: rina.id,
      content: 'Petugas Manggala Agni dan relawan sudah tiba dan mulai melakukan pembasahan lahan gambut. Asap masih terlihat di bagian tengah.',
      imageUrl: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=800&q=80',
    },
  });

  // 5. Create Comments
  await prisma.comment.create({
    data: {
      postId: emergencyPost.id,
      authorId: rangga.id,
      content: 'Regu relawan kami sedang meluncur ke Basarang membawa pompa jinjing & selang pemadam. Harap warga menjauh dari arah angin asap.',
    },
  });

  await prisma.comment.create({
    data: {
      postId: emergencyPost.id,
      authorId: sarah.id,
      content: 'Semoga cepat padam ya mas, tadi terlihat asapnya makin tebal dari arah jalan lintas.',
    },
  });

  // 6. Create Volunteer Assignment (Admin dispatches Rangga to Area 02 / Kapuas)
  await prisma.volunteerAssignment.create({
    data: {
      adminId: admin.id,
      volunteerId: rangga.id,
      postId: emergencyPost.id,
      clusterCode: 'Area Pantau 02',
      priorityLevel: PriorityLevel.P1,
      status: AssignmentStatus.ON_THE_WAY,
      notes: 'Laporan darurat warga di Basarang, Kapuas. Verifikasi titik api klaster Area Pantau 02 dan lakukan penanganan bersama regu pemadam.',
    },
  });

  // 7. Create Emergency Contacts 
  await prisma.emergencyContact.createMany({
    data: [
      { name: 'Pemadam Kebakaran', number: '113', category: 'Damkar', badgeColor: '#dc2626' },
      { name: 'Tim SAR', number: '115', category: 'SAR & Evakuasi', badgeColor: '#ea580c' },
      { name: 'Kepolisian', number: '110', category: 'Polisi', badgeColor: '#2563eb' },
      { name: 'Ambulans & Medis', number: '119', category: 'Kesehatan', badgeColor: '#059669' },
    ],
  });

  // 8. Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: rangga.id,
        title: 'Penugasan Lapangan Baru (Prioritas P1)',
        message: 'Admin Posko menugaskan kamu ke Area Pantau 02 (Desa Bancoh, Kec. Sungai Tebelian). Ketuk untuk lihat rute & detail.',
        type: NotificationType.TUGAS_BARU,
      },
      {
        userId: sarah.id,
        title: 'Peringatan Titik Api di Wilayah Anda',
        message: 'Pengamatan satelit dan 2 laporan warga mendeteksi anomali api 2,4 km dari lokasimu di Kec. Sintang.',
        type: NotificationType.ALERT_PRIORITAS,
      },
    ],
  });

  console.log('Seeding database selesai 100%!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
