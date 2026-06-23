import { BoardMemberRole } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class AddBoardMemberDto {
  @IsString()
  userId!: string;

  @IsEnum(BoardMemberRole)
  role!: BoardMemberRole;
}
