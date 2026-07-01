import { Module } from '@nestjs/common';
import { ActivityModule } from '../activity/activity.module';
import { BoardRoleGuard } from '../boards/guards/board-role.guard';
import { GatewayModule } from '../gateway/gateway.module';
import { ListBoardRoleGuard } from './guards/list-board-role.guard';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';

@Module({
  imports: [ActivityModule, GatewayModule],
  controllers: [ListsController],
  providers: [ListsService, BoardRoleGuard, ListBoardRoleGuard],
})
export class ListsModule {}
