import { Module } from '@nestjs/common';
import { ActivityModule } from '../activity/activity.module';
import { GatewayModule } from '../gateway/gateway.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { CardCommentsBoardRoleGuard } from './guards/card-comments-board-role.guard';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [ActivityModule, GatewayModule, NotificationsModule],
  controllers: [CommentsController],
  providers: [CommentsService, CardCommentsBoardRoleGuard],
})
export class CommentsModule {}
