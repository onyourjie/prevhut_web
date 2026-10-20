import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AssignmentStatus } from '@prisma/client';

export class UpdateStatusDto {
  @ApiProperty({
    enum: AssignmentStatus,
    example: AssignmentStatus.ON_THE_WAY,
    description: 'Status alur penugasan: ACCEPTED, ON_THE_WAY, ON_SITE, COMPLETED',
  })
  @IsEnum(AssignmentStatus)
  @IsNotEmpty()
  status: AssignmentStatus;
}
