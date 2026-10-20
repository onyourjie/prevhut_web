import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'Sarah Wijiyatno', description: 'Nama lengkap pengguna' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '+6281234567890', description: 'Nomor telepon aktif' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'sarahwijiyatno@gmail.com', description: 'Alamat email pengguna' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Kata sandi minimal 6 karakter' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: Role, default: Role.WARGA, description: 'Peran pengguna: WARGA atau RELAWAN' })
  @IsEnum(Role)
  role: Role;

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

  @ApiProperty({ example: -0.0712, required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ example: 111.4981, required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;
}
