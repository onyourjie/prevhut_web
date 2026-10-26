import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ModerationAction {
  REJECT_HOAX = 'REJECT_HOAX',
  APPROVE_VALID = 'APPROVE_VALID',
  DELETE_POST = 'DELETE_POST',
}

export class ModeratePostDto {
  @ApiProperty({ enum: ModerationAction, example: ModerationAction.REJECT_HOAX })
  @IsEnum(ModerationAction)
  action: ModerationAction;

  @ApiProperty({ example: 'Dikonfirmasi foto palsu setelah diverifikasi tim posko BPBD.', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
