import { Module } from '@nestjs/common';
import { BoardRoleGuard } from '../boards/guards/board-role.guard';
import { ListBoardRoleGuard } from './guards/list-board-role.guard';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';

@Module({
  controllers: [ListsController],
  providers: [ListsService, BoardRoleGuard, ListBoardRoleGuard],
})
export class ListsModule {}
