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

  @ApiProperty({ example: "sarahwijiyatno", description: "Username unik pengguna (tanpa spasi)" })
  @IsString()
  @IsNotEmpty({ message: "Username wajib diisi" })
  @MinLength(3, { message: "Username minimal 3 karakter" })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: "Username hanya boleh berisi huruf, angka, dan underscore" })
  username: string;


  @ApiProperty({
    example: '+6281234567890',
    description: 'Nomor telepon seluler Indonesia aktif (bisa format 08xx, 628xx, atau +628xx)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Nomor telepon wajib diisi' })
  @Matches(/^(?:\+62|62|0)8[1-9][0-9]{7,11}$/, {
    message: 'Nomor telepon harus nomor seluler Indonesia yang valid (contoh: 081234567890 atau +6281234567890)',
  })
  phone: string;

  @ApiProperty({
    example: 'sarahwijiyatno@gmail.com',
    description: 'Alamat email aktif pengguna (domain umum seperti .com, .id, .co.id, .go.id, dll)',
  })
  @IsNotEmpty({ message: 'Email wajib diisi' })
  @IsEmail({}, { message: 'Format alamat email tidak valid (contoh: nama@email.com atau nama@instansi.go.id)' })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Domain email harus lengkap dengan ekstensi yang valid (seperti .com, .id, .co.id, atau .go.id)',
  })
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
