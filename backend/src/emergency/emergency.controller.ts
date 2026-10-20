import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service.js';

@ApiTags('5. Panggilan Darurat & Evakuasi (Emergency)')
@Controller('emergency')
export class EmergencyController {
  constructor(private prisma: PrismaService) {}

  @Get('contacts')
  @ApiOperation({
    summary: 'Mendapatkan daftar nomor panggilan darurat',
    description: 'Menyediakan kontak siap panggil untuk Pemadam (113), Tim SAR (115), Polisi (110), dan Ambulans (119).',
  })
  @ApiResponse({ status: 200, description: 'Daftar nomor darurat terdaftar' })
  async getEmergencyContacts() {
    return this.prisma.emergencyContact.findMany({
      orderBy: { number: 'asc' },
    });
  }

  @Get('protocol')
  @ApiOperation({
    summary: 'Mendapatkan 5 langkah protokol panduan evakuasi cepat karhutla',
    description: 'Menampilkan protokol keselamatan pernapasan, arah angin, tas siaga, jalur evakuasi, dan instruksi posko.',
  })
  @ApiResponse({ status: 200, description: 'Langkah panduan evakuasi cepat' })
  getEvacuationProtocol() {
    return {
      title: 'Panduan & Protokol Evakuasi Cepat',
      subtitle: 'Tetap tenang, perhatikan arah angin, dan ikuti langkah darurat berikut secara berurutan:',
      steps: [
        {
          step: 1,
          title: 'Amankan Saluran Pernapasan',
          description: 'Pakai masker atau tutupi hidung & mulut dengan kain basah berlapis ganda untuk menyaring partikel berbahaya.',
          icon: 'mask',
        },
        {
          step: 2,
          title: 'Kenali Arah Angin & Asap',
          description: 'Perhatikan hembusan angin. Jangan pernah bergerak searah jalur asap atau gambut kering.',
          icon: 'wind',
        },
        {
          step: 3,
          title: 'Bawa Tas Siaga',
          description: 'Bawa surat berharga, obat pribadi darurat, senter, air minum bersih, serta identitas pengenal.',
          icon: 'briefcase',
        },
        {
          step: 4,
          title: 'Ikuti Jalur Evakuasi',
          description: 'Segera menuju posko evakuasi terdekat. Hindari menyeberangi semak belukar gambut.',
          icon: 'map-pin',
        },
        {
          step: 5,
          title: 'Tunggu Hingga Ada Info Resmi',
          description: 'Jangan kembali ke lokasi sebelum ada pengumuman resmi dari posko komando BPBD.',
          icon: 'shield-check',
        },
      ],
    };
  }
}
