import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { Board } from '../models';
import {
  loadBoard,
  loadBoardFailure,
  loadBoardSuccess,
  loadMyBoards,
  loadMyBoardsFailure,
  loadMyBoardsSuccess,
} from './boards.actions';

@Injectable()
export class BoardsEffects {
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);

  readonly loadMyBoards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMyBoards),
      switchMap(() =>
        this.http.get<Board[]>('/boards').pipe(
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
        this.http.get<Board>(`/boards/${boardId}`).pipe(
          map((board) => loadBoardSuccess({ board })),
          catchError((error: unknown) => of(loadBoardFailure({ error: this.getErrorMessage(error) }))),
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
