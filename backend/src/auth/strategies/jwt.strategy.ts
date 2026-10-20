import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service.js';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'fireline_jwt_secret_key_wia_mia_2026'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
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
        isAvailable: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Pengguna tidak ditemukan atau sesi telah berakhir');
    }

    return user;
  }
}
