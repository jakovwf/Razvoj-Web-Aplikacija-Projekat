import { Module } from '@nestjs/common';
import { CardCommentsBoardRoleGuard } from './guards/card-comments-board-role.guard';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, CardCommentsBoardRoleGuard],
})
export class CommentsModule {}
