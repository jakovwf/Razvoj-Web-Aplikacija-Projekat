import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, map, take } from 'rxjs';
import { AuthService } from '../../core/services/auth';
import { InviteService } from '../../core/services/invite';
import { loadMyBoards } from '../../store/boards/boards.actions';
import { BoardInvite } from '../../store/models';

@Component({
  selector: 'app-invite',
  imports: [],
  templateUrl: './invite.html',
  styleUrl: './invite.scss',
})
export class Invite {
  private readonly authService = inject(AuthService);
  private readonly inviteService = inject(InviteService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  token: string | null = null;
  invite: BoardInvite | null = null;
  loading = false;
  actionLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor() {
    this.route.paramMap
      .pipe(
        map((params) => params.get('token')),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe((token) => {
        this.token = token;

        if (token) {
          this.loadInvite(token);
        }
      });
  }

  acceptInvite(): void {
    if (!this.token) {
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.redirectToLogin();
      return;
    }

    this.actionLoading = true;
    this.error = null;

    this.inviteService
      .acceptInvite(this.token)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          const boardId = response.invite.board?.id ?? this.invite?.board?.id;

          this.store.dispatch(loadMyBoards());
          this.actionLoading = false;
          void this.router.navigate(boardId ? ['/b', boardId] : ['/home']);
        },
        error: (error: unknown) => this.handleInviteActionError(error, 'Invite nije prihvacen.'),
      });
  }

  declineInvite(): void {
    if (!this.token) {
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.redirectToLogin();
      return;
    }

    this.actionLoading = true;
    this.error = null;

    this.inviteService
      .declineInvite(this.token)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.actionLoading = false;
          void this.router.navigate(['/home']);
        },
        error: (error: unknown) => this.handleInviteActionError(error, 'Invite nije odbijen.'),
      });
  }

  private loadInvite(token: string): void {
    this.loading = true;
    this.error = null;
    this.successMessage = null;

    this.inviteService
      .getInvite(token)
      .pipe(take(1))
      .subscribe({
        next: (invite) => {
          this.invite = invite;
          this.loading = false;
        },
        error: () => {
          this.error = 'Invite nije pronadjen ili vise nije aktivan.';
          this.loading = false;
        },
      });
  }

  private redirectToLogin(): void {
    const returnUrl = this.token ? `/invite/${this.token}` : '/home';
    void this.router.navigate(['/login'], { queryParams: { returnUrl } });
  }

  private handleInviteActionError(error: unknown, fallbackMessage: string): void {
    this.actionLoading = false;

    if (error instanceof HttpErrorResponse && error.status === 401) {
      this.redirectToLogin();
      return;
    }

    this.error = this.getErrorMessage(error) ?? fallbackMessage;
  }

  private getErrorMessage(error: unknown): string | null {
    if (error instanceof HttpErrorResponse) {
      const responseError = error.error as { message?: string } | string | undefined;

      if (typeof responseError === 'string') {
        return responseError;
      }

      return responseError?.message ?? error.message;
    }

    return null;
  }
}
