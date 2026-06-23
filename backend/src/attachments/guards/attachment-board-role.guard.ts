import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BoardMemberRole } from '@prisma/client';
import { Request } from 'express';
import { BOARD_ROLES_KEY } from '../../boards/decorators/roles.decorator';
import { PrismaService } from '../../prisma/prisma.service';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

@Injectable()
export class AttachmentBoardRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedRoles =
      this.reflector.getAllAndOverride<BoardMemberRole[]>(BOARD_ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userId = request.user?.userId;
    const boardId = await this.getBoardId(request);

    if (!userId || !boardId) {
      throw new ForbiddenException('Attachment access denied');
    }

    const membership = await this.prisma.boardMember.findUnique({
      where: {
        boardId_userId: {
          boardId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this board');
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(membership.role)) {
      throw new ForbiddenException('Insufficient board permissions');
    }

    return true;
  }

  private async getBoardId(request: Request): Promise<string | null> {
    const cardIdParam = request.params.cardId;
    const cardId = Array.isArray(cardIdParam) ? cardIdParam[0] : cardIdParam;

    if (cardId) {
      const card = await this.prisma.card.findUnique({
        where: { id: cardId },
        select: {
          list: {
            select: { boardId: true },
          },
        },
      });

      if (!card) {
        throw new NotFoundException('Card not found');
      }

      return card.list.boardId;
    }

    const attachmentIdParam = request.params.attachmentId ?? request.params.id;
    const attachmentId = Array.isArray(attachmentIdParam)
      ? attachmentIdParam[0]
      : attachmentIdParam;

    if (!attachmentId) {
      return null;
    }

    const attachment = await this.prisma.attachment.findUnique({
      where: { id: attachmentId },
      select: {
        card: {
          select: {
            list: {
              select: { boardId: true },
            },
          },
        },
      },
    });

    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    return attachment.card.list.boardId;
  }
}
