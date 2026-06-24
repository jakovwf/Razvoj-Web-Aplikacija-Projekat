import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { Notification } from '../models';
import {
  loadNotifications,
  loadNotificationsFailure,
  loadNotificationsSuccess,
  markAllAsRead,
  markAllAsReadSuccess,
  markAsRead,
  markAsReadSuccess,
} from './notifications.actions';

@Injectable()
export class NotificationsEffects {
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);

  readonly loadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadNotifications),
      switchMap(() =>
        this.http.get<Notification[]>('/notifications').pipe(
          map((notifications) => loadNotificationsSuccess({ notifications })),
          catchError(() => of(loadNotificationsFailure())),
        ),
      ),
    ),
  );

  readonly markAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(markAsRead),
      switchMap(({ id }) =>
        this.http.patch<Notification>(`/notifications/${id}/read`, {}).pipe(
          map((notification) => markAsReadSuccess({ notification })),
          catchError(() => of(loadNotificationsFailure())),
        ),
      ),
    ),
  );

  readonly markAllAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(markAllAsRead),
      switchMap(() =>
        this.http.patch('/notifications/read-all', {}).pipe(
          map(() => markAllAsReadSuccess()),
          catchError(() => of(loadNotificationsFailure())),
        ),
      ),
    ),
  );
}
