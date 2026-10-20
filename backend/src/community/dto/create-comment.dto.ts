import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'Regu relawan kami sedang meluncur ke Desa Bancoh membawa pompa jinjing.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=800', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
