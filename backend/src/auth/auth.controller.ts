import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from './decorators/current-user.decorator.js';

@ApiTags('1. Autentikasi (Auth)')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrasi akun baru',
    description: 'Mendaftarkan akun Warga atau Relawan dengan validasi kata sandi kuat (min 8 karakter, huruf besar, kecil, angka, simbol).',
  })
  @ApiResponse({ status: 201, description: 'Akun berhasil dibuat dan mengembalikan token JWT untuk autentikasi' })
  @ApiResponse({ status: 400, description: 'Validasi gagal: Kata sandi tidak memenuhi kriteria keamanan' })
  @ApiResponse({ status: 409, description: 'Email atau nomor telepon telah terdaftar' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Masuk dengan email dan kata sandi',
    description: 'Autentikasi akun demo (Admin123!, Rangga123!, Sarah123!) dan menghasilkan JWT Bearer Token.',
  })
  @ApiResponse({ status: 200, description: 'Berhasil masuk dan mengembalikan token JWT serta data profil' })
  @ApiResponse({ status: 401, description: 'Email atau kata sandi tidak valid' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Cek sesi & profil pengguna aktif dari Bearer Token',
    description: 'Mengembalikan data pengguna yang sedang login berdasarkan header Authorization: Bearer <token>.',
  })
  @ApiResponse({ status: 200, description: 'Token valid dan sesi aktif' })
  @ApiResponse({ status: 401, description: 'Token tidak valid atau telah kedaluwarsa' })
  getProfile(@CurrentUser() user: any) {
    return {
      status: 'authenticated',
      user,
    };
  }
}
