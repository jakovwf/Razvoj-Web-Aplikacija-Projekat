import { Injectable, inject } from '@angular/core';
import { BoardList, Card } from '../../store/models';
import { SocketService } from './socket.service';

@Injectable({ providedIn: 'root' })
export class BoardSocketService {
  private readonly socketService = inject(SocketService);

  readonly cardCreated$ = this.socketService.on<{ card: Card; listId: string }>('card:created');
  readonly cardUpdated$ = this.socketService.on<{ card: Card }>('card:updated');
  readonly cardDeleted$ = this.socketService.on<{ cardId: string; listId: string }>('card:deleted');
  readonly cardsReordered$ = this.socketService.on<{
    items: { id: string; listId: string; position: number }[];
  }>('cards:reordered');
  readonly listCreated$ = this.socketService.on<{ list: BoardList }>('list:created');
  readonly listUpdated$ = this.socketService.on<{ list: BoardList }>('list:updated');
  readonly listDeleted$ = this.socketService.on<{ listId: string }>('list:deleted');
  readonly listsReordered$ = this.socketService.on<{
    items: { id: string; position: number }[];
  }>('lists:reordered');
}
