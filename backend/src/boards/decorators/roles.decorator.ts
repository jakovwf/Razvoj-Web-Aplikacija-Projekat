import { SetMetadata } from '@nestjs/common';
import { BoardMemberRole } from '@prisma/client';

export const BOARD_ROLES_KEY = 'boardRoles';

export const Roles = (...roles: BoardMemberRole[]) =>
  SetMetadata(BOARD_ROLES_KEY, roles);
