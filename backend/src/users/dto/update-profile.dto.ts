import { IsBoolean, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Sarah Wijiyatno', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '+6281234567890', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256', required: false })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({ example: 'Kalimantan Barat', required: false })
  @IsString()
  @IsOptional()
  province?: string;

  @ApiProperty({ example: 'Kabupaten Sintang', required: false })
  @IsString()
  @IsOptional()
  kabupaten?: string;

  @ApiProperty({ example: 'Kecamatan Sintang', required: false })
  @IsString()
  @IsOptional()
  kecamatan?: string;

  @ApiProperty({ example: true, description: 'Toggle GPS Selalu Aktif dari profil', required: false })
  @IsBoolean()
  @IsOptional()
  isGpsAlwaysActive?: boolean;

  @ApiProperty({ example: true, description: 'Status ketersediaan penugasan untuk Relawan', required: false })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({ example: -0.0712, required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ example: 111.4981, required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;
}
