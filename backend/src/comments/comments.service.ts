import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BoardMemberRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(cardId: string) {
    return this.prisma.comment.findMany({
      where: { cardId },
      include: this.commentInclude,
      orderBy: { createdAt: 'asc' },
    });
  }

  create(cardId: string, authorId: string, createCommentDto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        cardId,
        authorId,
        content: createCommentDto.content,
      },
      include: this.commentInclude,
    });
  }

  async update(
    id: string,
    userId: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('Only the comment author can edit this');
    }

    return this.prisma.comment.update({
      where: { id },
      data: { content: updateCommentDto.content },
      include: this.commentInclude,
    });
  }

  async remove(id: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      select: {
        authorId: true,
        card: {
          select: {
            list: {
              select: { boardId: true },
            },
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      const membership = await this.prisma.boardMember.findUnique({
        where: {
          boardId_userId: {
            boardId: comment.card.list.boardId,
            userId,
          },
        },
      });

      if (
        !membership ||
        (membership.role !== BoardMemberRole.OWNER &&
          membership.role !== BoardMemberRole.ADMIN)
      ) {
        throw new ForbiddenException(
          'Only the comment author or board admin can delete this',
        );
      }
    }

    return this.prisma.comment.delete({
      where: { id },
      include: this.commentInclude,
    });
  }

  private readonly safeUserSelect = {
    id: true,
    email: true,
    displayName: true,
    avatarUrl: true,
    createdAt: true,
  };

  private readonly commentInclude = {
    author: {
      select: this.safeUserSelect,
    },
  };
}
