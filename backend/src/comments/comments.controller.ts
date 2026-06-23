import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BoardMemberRole } from '@prisma/client';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../boards/decorators/roles.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CardCommentsBoardRoleGuard } from './guards/card-comments-board-role.guard';
import { CommentsService } from './comments.service';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Roles(
    BoardMemberRole.OWNER,
    BoardMemberRole.ADMIN,
    BoardMemberRole.MEMBER,
  )
  @UseGuards(CardCommentsBoardRoleGuard)
  @Get('cards/:cardId/comments')
  findAll(@Param('cardId') cardId: string) {
    return this.commentsService.findAll(cardId);
  }

  @Roles(
    BoardMemberRole.OWNER,
    BoardMemberRole.ADMIN,
    BoardMemberRole.MEMBER,
  )
  @UseGuards(CardCommentsBoardRoleGuard)
  @Post('cards/:cardId/comments')
  create(
    @Param('cardId') cardId: string,
    @Req() request: AuthenticatedRequest,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(
      cardId,
      request.user.userId,
      createCommentDto,
    );
  }

  @Patch('comments/:id')
  update(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, request.user.userId, updateCommentDto);
  }

  @Delete('comments/:id')
  remove(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.commentsService.remove(id, request.user.userId);
  }
}
