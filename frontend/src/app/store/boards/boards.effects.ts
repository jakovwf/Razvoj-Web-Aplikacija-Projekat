import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { BoardService } from '../../core/services/board';
import { CardService } from '../../core/services/card';
import { ListService } from '../../core/services/list';
import {
  createBoard,
  createBoardFailure,
  createBoardSuccess,
  createCard,
  createCardFailure,
  createCardSuccess,
  createList,
  createListFailure,
  createListSuccess,
  deleteCard,
  deleteCardFailure,
  deleteCardSuccess,
  deleteList,
  deleteListFailure,
  deleteListSuccess,
  loadBoard,
  loadBoardFailure,
  loadBoardSuccess,
  loadMyBoards,
  loadMyBoardsFailure,
  loadMyBoardsSuccess,
  updateCard,
  updateCardFailure,
  updateCardSuccess,
  updateList,
  updateListFailure,
  updateListSuccess,
} from './boards.actions';

@Injectable()
export class BoardsEffects {
  private readonly actions$ = inject(Actions);
  private readonly boardService = inject(BoardService);
  private readonly listService = inject(ListService);
  private readonly cardService = inject(CardService);

  readonly loadMyBoards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMyBoards),
      switchMap(() =>
        this.boardService.getBoards().pipe(
          map((boards) => loadMyBoardsSuccess({ boards })),
          catchError((error: unknown) => of(loadMyBoardsFailure({ error: this.getErrorMessage(error) }))),
        ),
      ),
    ),
  );

  readonly loadBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBoard),
      switchMap(({ boardId }) =>
        this.boardService.getBoard(boardId).pipe(
          map((board) => loadBoardSuccess({ board })),
          catchError((error: unknown) => of(loadBoardFailure({ error: this.getErrorMessage(error) }))),
        ),
      ),
    ),
  );

  readonly createBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createBoard),
      switchMap(({ workspaceId, title, description }) =>
        this.boardService.createBoard(workspaceId, { title, description }).pipe(
          map((board) => createBoardSuccess({ board })),
          catchError((error: unknown) => of(createBoardFailure({ error: this.getErrorMessage(error) }))),
        ),
      ),
    ),
  );

  readonly createList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createList),
      switchMap(({ boardId, title }) =>
        this.listService.createList(boardId, { title }).pipe(
          map((list) => createListSuccess({ list })),
          catchError((error: unknown) => of(createListFailure({ error: this.getErrorMessage(error) }))),
        ),
      ),
    ),
  );

  readonly updateList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateList),
      switchMap(({ listId, title }) =>
        this.listService.updateList(listId, { title }).pipe(
          map((list) => updateListSuccess({ list })),
          catchError((error: unknown) => of(updateListFailure({ error: this.getErrorMessage(error) }))),
        ),
      ),
    ),
  );

  readonly deleteList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteList),
      switchMap(({ listId }) =>
        this.listService.deleteList(listId).pipe(
          map((list) => deleteListSuccess({ listId: list.id })),
          catchError((error: unknown) => of(deleteListFailure({ error: this.getErrorMessage(error) }))),
        ),
      ),
    ),
  );

  readonly createCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createCard),
      switchMap(({ listId, title, description }) =>
        this.cardService.createCard(listId, { title, description }).pipe(
          map((card) => createCardSuccess({ card })),
          catchError((error: unknown) => of(createCardFailure({ error: this.getErrorMessage(error) }))),
        ),
      ),
    ),
  );

  readonly updateCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCard),
      switchMap(({ cardId, title, description }) =>
        this.cardService.updateCard(cardId, { title, description }).pipe(
          map((card) => updateCardSuccess({ card })),
          catchError((error: unknown) => of(updateCardFailure({ error: this.getErrorMessage(error) }))),
        ),
      ),
    ),
  );

  readonly deleteCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteCard),
      switchMap(({ cardId }) =>
        this.cardService.deleteCard(cardId).pipe(
          map((card) => deleteCardSuccess({ cardId: card.id, listId: card.listId })),
          catchError((error: unknown) => of(deleteCardFailure({ error: this.getErrorMessage(error) }))),
        ),
      ),
    ),
  );

  private getErrorMessage(error: unknown): string {
    return typeof error === 'object' && error !== null && 'message' in error
      ? String((error as { message?: string }).message)
      : 'Request failed.';
  }
}
