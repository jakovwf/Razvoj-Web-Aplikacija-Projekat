import { BoardMemberRole } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateBoardMemberDto {
  @IsEnum(BoardMemberRole)
  role!: BoardMemberRole;
}
