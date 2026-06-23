import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListDto } from './dto/create-list.dto';
import { ReorderListsDto } from './dto/reorder-lists.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(boardId: string, createListDto: CreateListDto) {
    const aggregate = await this.prisma.list.aggregate({
      where: { boardId },
      _max: { position: true },
    });

    return this.prisma.list.create({
      data: {
        title: createListDto.title,
        boardId,
        position: (aggregate._max.position ?? 0) + 1,
      },
      include: this.listInclude,
    });
  }

  update(id: string, updateListDto: UpdateListDto) {
    return this.prisma.list.update({
      where: { id },
      data: {
        title: updateListDto.title,
      },
      include: this.listInclude,
    });
  }

  remove(id: string) {
    return this.prisma.list.delete({
      where: { id },
      include: this.listInclude,
    });
  }

  async reorder(boardId: string, reorderListsDto: ReorderListsDto) {
    return this.prisma.$transaction(async (tx) => {
      const updates = await Promise.all(
        reorderListsDto.items.map((item) =>
          tx.list.updateMany({
            where: {
              id: item.id,
              boardId,
            },
            data: {
              position: item.position,
            },
          }),
        ),
      );

      if (updates.some((result) => result.count === 0)) {
        throw new NotFoundException('One or more lists were not found');
      }

      return tx.list.findMany({
        where: { boardId },
        include: this.listInclude,
        orderBy: { position: 'asc' },
      });
    });
  }

  private readonly listInclude = {
    cards: true,
  };
}
