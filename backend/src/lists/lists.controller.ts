import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BoardMemberRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../boards/decorators/roles.decorator';
import { BoardRoleGuard } from '../boards/guards/board-role.guard';
import { CreateListDto } from './dto/create-list.dto';
import { ReorderListsDto } from './dto/reorder-lists.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListBoardRoleGuard } from './guards/list-board-role.guard';
import { ListsService } from './lists.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Roles(
    BoardMemberRole.OWNER,
    BoardMemberRole.ADMIN,
    BoardMemberRole.MEMBER,
  )
  @UseGuards(BoardRoleGuard)
  @Post('boards/:boardId/lists')
  create(
    @Param('boardId') boardId: string,
    @Body() createListDto: CreateListDto,
  ) {
    return this.listsService.create(boardId, createListDto);
  }

  @Roles(
    BoardMemberRole.OWNER,
    BoardMemberRole.ADMIN,
    BoardMemberRole.MEMBER,
  )
  @UseGuards(ListBoardRoleGuard)
  @Patch('lists/:id')
  update(@Param('id') id: string, @Body() updateListDto: UpdateListDto) {
    return this.listsService.update(id, updateListDto);
  }

  @Roles(BoardMemberRole.OWNER, BoardMemberRole.ADMIN)
  @UseGuards(ListBoardRoleGuard)
  @Delete('lists/:id')
  remove(@Param('id') id: string) {
    return this.listsService.remove(id);
  }

  @Roles(BoardMemberRole.OWNER, BoardMemberRole.ADMIN)
  @UseGuards(BoardRoleGuard)
  @Patch('boards/:boardId/lists/reorder')
  reorder(
    @Param('boardId') boardId: string,
    @Body() reorderListsDto: ReorderListsDto,
  ) {
    return this.listsService.reorder(boardId, reorderListsDto);
  }
}
