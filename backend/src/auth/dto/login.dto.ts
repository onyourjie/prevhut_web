import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    example: "admin.posko@fireline.id",
    description: "Alamat email atau username terdaftar (Coba: adminposko, ranggawicaksono, atau sarahwijiyatno)",
  })
  @IsString()
  @IsNotEmpty({ message: "Email atau username wajib diisi" })
  identifier: string;

  // Optional legacy fields for backwards compatibility
  @ApiProperty({ required: false, example: "sarahwijiyatno@gmail.com" })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false, example: "sarahwijiyatno" })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    example: "Admin123!",
    description: "Kata sandi akun (Coba: Admin123!, Rangga123!, atau Sarah123!)",
  })
  @IsString()
  @IsNotEmpty({ message: "Kata sandi wajib diisi" })
  password: string;
}
