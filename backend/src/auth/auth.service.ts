import { Injectable, ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service.js";
import { RegisterDto } from "./dto/register.dto.js";
import { LoginDto } from "./dto/login.dto.js";


function normalizeIndonesianPhone(phone: string): string {
  let cleaned = phone.replace(/[^0-9+]/g, '').trim();
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  if (cleaned.startsWith('08')) {
    cleaned = '62' + cleaned.substring(1);
  }
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  return cleaned;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const cleanUsername = dto.username.toLowerCase().trim();
    const cleanEmail = dto.email.toLowerCase().trim();
    const cleanPhone = normalizeIndonesianPhone(dto.phone);

    const existingUsername = await this.prisma.user.findUnique({
      where: { username: cleanUsername },
    });
    if (existingUsername) {
      throw new ConflictException("Username @" + cleanUsername + " sudah digunakan. Silakan gunakan username lain.");
    }

    const existingEmail = await this.prisma.user.findUnique({
      where: { email: cleanEmail },
    });
    if (existingEmail) {
      throw new ConflictException("Alamat email sudah terdaftar. Silakan gunakan email lain atau masuk.");
    }

    const existingPhone = await this.prisma.user.findUnique({
      where: { phone: cleanPhone },
    });
    if (existingPhone) {
      throw new ConflictException("Nomor telepon sudah terdaftar. Silakan periksa kembali.");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const defaultAvatar =
      dto.role === "RELAWAN"
        ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"
        : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80";

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        username: cleanUsername,
        phone: cleanPhone,
        email: cleanEmail,
        password: hashedPassword,
        role: dto.role,
        avatarUrl: defaultAvatar,
        province: dto.province ?? "Kalimantan Barat",
        kabupaten: dto.kabupaten ?? "Kabupaten Sintang",
        kecamatan: dto.kecamatan ?? "Kecamatan Sintang",
        latitude: dto.latitude ?? -0.0712,
        longitude: dto.longitude ?? 111.4981,
      },
      select: {
        id: true,
        name: true,
        username: true,
        phone: true,
        email: true,
        role: true,
        avatarUrl: true,
        province: true,
        kabupaten: true,
        kecamatan: true,
        latitude: true,
        longitude: true,
        isGpsAlwaysActive: true,
        createdAt: true,
      },
    });

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    return {
      message: `Selamat datang, ${user.name}! Akun berhasil didaftarkan.`,
      access_token: token,
      user,
    };
  }

  async login(dto: LoginDto) {
    const loginKey = (dto.identifier || dto.email || dto.username || "").trim();

    if (!loginKey) {
      throw new UnauthorizedException("Email atau username wajib diisi");
    }

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: loginKey, mode: "insensitive" } },
          { username: { equals: loginKey.toLowerCase(), mode: "insensitive" } },
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedException("Email, username, atau kata sandi tidak valid");
    }

    const isPasswordMatch = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException("Email, username, atau kata sandi tidak valid");
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    const { password, ...safeUser } = user;

    return {
      message: `Selamat datang kembali, ${safeUser.name}!`,
      access_token: token,
      user: safeUser,
    };
  }
}
