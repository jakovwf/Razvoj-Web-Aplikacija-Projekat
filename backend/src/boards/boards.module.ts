import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { BoardRoleGuard } from './guards/board-role.guard';

@Module({
  controllers: [BoardsController],
  providers: [BoardsService, BoardRoleGuard],
})
export class BoardsModule {}
