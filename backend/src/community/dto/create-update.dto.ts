import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUpdateDto {
  @ApiProperty({ example: 'Petugas dan relawan sudah tiba dan mulai melakukan pemadaman.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
