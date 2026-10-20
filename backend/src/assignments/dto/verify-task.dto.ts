import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyTaskDto {
  @ApiProperty({ example: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=800', description: 'Foto bukti verifikasi lapangan' })
  @IsString()
  @IsNotEmpty()
  verificationPhoto: string;

  @ApiProperty({ example: -0.1255, description: 'Latitude koordinat GPS saat verifikasi di lapangan' })
  @IsNumber()
  verificationGpsLat: number;

  @ApiProperty({ example: 111.4822, description: 'Longitude koordinat GPS saat verifikasi di lapangan' })
  @IsNumber()
  verificationGpsLon: number;

  @ApiProperty({ example: 'Api di lahan gambut seluas 1.5 Ha berhasil dikendalikan bersama regu Manggala Agni dan warga sekitar.', required: false })
  @IsString()
  @IsOptional()
  completionNotes?: string;
}
