import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PriorityLevel } from '@prisma/client';

export class CreateAssignmentDto {
  @ApiProperty({ example: 'uuid-relawan-id', description: 'ID pengguna relawan yang ditugaskan' })
  @IsString()
  @IsNotEmpty()
  volunteerId: string;

  @ApiProperty({ example: 'uuid-post-id', required: false, description: 'ID postingan laporan warga terkait (opsional)' })
  @IsString()
  @IsOptional()
  postId?: string;

  @ApiProperty({ example: 'Area Pantau 02', required: false, description: 'Kode Area Pantauan (DBSCAN Cluster)' })
  @IsString()
  @IsOptional()
  clusterCode?: string;

  @ApiProperty({ enum: PriorityLevel, default: PriorityLevel.P1, description: 'Tingkat prioritas penanganan' })
  @IsEnum(PriorityLevel)
  priorityLevel: PriorityLevel;

  @ApiProperty({ example: 'Titik api terdeteksi mendekati pemukiman Desa Bancoh (jarak 4.8 km). Segera verifikasi dan koordinasikan pemadaman.', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
