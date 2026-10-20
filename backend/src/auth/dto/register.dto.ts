import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, Matches, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum RegisterableRole {
  WARGA = 'WARGA',
  RELAWAN = 'RELAWAN',
}

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

  @ApiProperty({
    example: 'Sarah123!',
    description: 'Kata sandi minimal 8 karakter, wajib kombinasi huruf besar, kecil, angka, dan karakter unik (simbol)',
  })
  @IsString()
  @MinLength(8, { message: 'Kata sandi minimal harus 8 karakter' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, {
    message: 'Kata sandi harus mengandung kombinasi huruf besar, huruf kecil, angka, dan karakter unik/simbol (contoh: Sarah123!)',
  })
  password: string;

  @ApiProperty({
    enum: RegisterableRole,
    default: RegisterableRole.WARGA,
    description: 'Pilihan peran saat mendaftar: WARGA atau RELAWAN (Akun Admin Posko murni akun internal dan tidak dapat didaftarkan secara publik)',
  })
  @IsEnum(RegisterableRole, {
    message: 'Peran pendaftaran hanya diizinkan untuk WARGA atau RELAWAN. Akun Admin Posko dikelola secara internal oleh instansi.',
  })
  role: RegisterableRole;

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
