import { WorkspaceMemberRole } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class AddWorkspaceMemberDto {
  @IsString()
  userId!: string;

  @IsEnum(WorkspaceMemberRole)
  role!: WorkspaceMemberRole;
}
