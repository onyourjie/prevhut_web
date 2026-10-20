import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'admin.posko@fireline.id',
    description: 'Alamat email terdaftar (Coba: admin.posko@fireline.id, rangga.relawan@gmail.com, atau sarahwijiyatno@gmail.com)',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Admin123!',
    description: 'Kata sandi akun (Coba: Admin123!, Rangga123!, atau Sarah123!)',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
