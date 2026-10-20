import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PostCategory } from '@prisma/client';

export class CreatePostDto {
  @ApiProperty({ enum: PostCategory, default: PostCategory.DARURAT })
  @IsEnum(PostCategory)
  category: PostCategory;

  @ApiProperty({ example: 'Terlihat api di lahan kosong dekat jalan desa bancoh. Saya sudah melapor pada petugas.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=800', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: true, default: true, description: 'Foto diambil secara langsung menggunakan kamera perangkat' })
  @IsBoolean()
  @IsOptional()
  isLiveCamera?: boolean;

  @ApiProperty({ example: 'Jl. Tunas Rimba No. 18, RT 003/RW 002, Kec. Sungai Tebelian, Kab. Sintang' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Kalimantan Barat', required: false })
  @IsString()
  @IsOptional()
  province?: string;

  @ApiProperty({ example: 'Kabupaten Sintang', required: false })
  @IsString()
  @IsOptional()
  kabupaten?: string;

  @ApiProperty({ example: 'Kecamatan Sungai Tebelian', required: false })
  @IsString()
  @IsOptional()
  kecamatan?: string;

  @ApiProperty({ example: -0.1255 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 111.4822 })
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: 'Area Pantau 02', required: false })
  @IsString()
  @IsOptional()
  clusterCode?: string;
}
