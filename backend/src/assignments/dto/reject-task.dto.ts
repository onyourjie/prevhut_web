import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RejectTaskDto {
  @ApiProperty({ example: 'Sedang bertugas di lokasi lain / keterbatasan peralatan pemadam di zona tersebut.' })
  @IsString()
  @IsNotEmpty()
  rejectionReason: string;
}
