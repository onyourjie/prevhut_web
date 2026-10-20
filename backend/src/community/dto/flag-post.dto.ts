import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ModerationReason } from '@prisma/client';

export class FlagPostDto {
  @ApiProperty({ enum: ModerationReason, example: ModerationReason.FOTO_LOKASI_TIDAK_SESUAI })
  @IsEnum(ModerationReason)
  reason: ModerationReason;

  @ApiProperty({ example: 'Foto diduga terjadi di lokasi lain atau diambil dari internet.', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
