import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from './decorators/current-user.decorator.js';

@ApiTags('Authentication (Warga, Relawan, Admin)')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrasi akun baru (Multi-step flow di Figma)' })
  @ApiResponse({ status: 201, description: 'Akun berhasil dibuat dan mengembalikan token JWT' })
  @ApiResponse({ status: 409, description: 'Email atau nomor telepon telah terdaftar' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Masuk dengan email dan kata sandi' })
  @ApiResponse({ status: 200, description: 'Berhasil masuk dan mengembalikan token JWT' })
  @ApiResponse({ status: 401, description: 'Email atau kata sandi salah' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mendapatkan profil pengguna aktif dari Bearer Token' })
  getProfile(@CurrentUser() user: any) {
    return {
      status: 'authenticated',
      user,
    };
  }
}
