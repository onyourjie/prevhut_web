import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'sarahwijiyatno@gmail.com', description: 'Alamat email terdaftar' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Kata sandi' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
