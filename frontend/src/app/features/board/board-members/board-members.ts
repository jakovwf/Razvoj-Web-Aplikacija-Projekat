import { Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { distinctUntilChanged, forkJoin, map, take } from 'rxjs';
import { BoardService } from '../../../core/services/board';
import { Board, BoardInvite, BoardMember } from '../../../store/models';

@Component({
  selector: 'app-board-members',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './board-members.html',
  styleUrl: './board-members.scss',
})
export class BoardMembers {
  private readonly boardService = inject(BoardService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  boardId: string | null = null;
  board: Board | null = null;
  members: BoardMember[] = [];
  invites: BoardInvite[] = [];
  loading = false;
  inviteSaving = false;
  revokeLoadingInviteId: string | null = null;
  error: string | null = null;
  successMessage: string | null = null;

  readonly inviteForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    this.route.paramMap
      .pipe(
        map((params) => params.get('boardId')),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe((boardId) => {
        this.boardId = boardId;

        if (boardId) {
          this.loadBoardMembers(boardId);
          return;
        }

        this.error = 'Board nije pronadjen.';
      });
  }

  createInvite(): void {
    if (!this.boardId || this.inviteForm.invalid) {
      this.inviteForm.markAllAsTouched();
      return;
    }

    const inviteeEmail = this.inviteForm.getRawValue().email.trim();

    if (!inviteeEmail) {
      this.inviteForm.markAllAsTouched();
      return;
    }

    this.inviteSaving = true;
    this.error = null;
    this.successMessage = null;

    this.boardService
      .createBoardInvite(this.boardId, { inviteeEmail })
      .pipe(take(1))
      .subscribe({
        next: (invite) => {
          this.invites = [invite, ...this.invites];
          this.inviteForm.reset();
          this.inviteSaving = false;
          this.successMessage = 'Invite je poslat i dodat u pending listu.';
        },
        error: (error: unknown) => {
          this.error = this.getErrorMessage(error, 'Invite nije poslat.');
          this.inviteSaving = false;
        },
      });
  }

  revokeInvite(inviteId: string): void {
    if (!this.boardId || !confirm('Da li zelite da povucete ovaj invite?')) {
      return;
    }

    this.error = null;
    this.successMessage = null;
    this.revokeLoadingInviteId = inviteId;

    this.boardService
      .deleteBoardInvite(this.boardId, inviteId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.invites = this.invites.filter((invite) => invite.id !== inviteId);
          this.revokeLoadingInviteId = null;
          this.successMessage = 'Invite je povucen.';
        },
        error: (error: unknown) => {
          this.error = this.getErrorMessage(error, 'Invite nije povucen.');
          this.revokeLoadingInviteId = null;
        },
      });
  }

  async copyInviteLink(invite: BoardInvite): Promise<void> {
    this.error = null;
    this.successMessage = null;

    const inviteLink = this.getInviteLink(invite);

    try {
      await navigator.clipboard.writeText(inviteLink);
      this.successMessage = 'Invite link kopiran.';
    } catch {
      this.error = 'Invite link nije kopiran. Pokusaj ponovo.';
    }
  }

  getInviteLink(invite: BoardInvite): string {
    return `${window.location.origin}/invite/${invite.token}`;
  }

  private loadBoardMembers(boardId: string): void {
    this.loading = true;
    this.error = null;
    this.successMessage = null;

    forkJoin({
      board: this.boardService.getBoard(boardId),
      members: this.boardService.getBoardMembers(boardId),
      invites: this.boardService.getBoardInvites(boardId),
    })
      .pipe(take(1))
      .subscribe({
        next: ({ board, members, invites }) => {
          this.board = board;
          this.members = members;
          this.invites = invites.filter((invite) => invite.status === 'PENDING');
          this.loading = false;
        },
        error: (error: unknown) => {
          this.error = this.getErrorMessage(error, 'Clanovi boarda nisu ucitani.');
          this.loading = false;
        },
      });
  }

  private getErrorMessage(error: unknown, fallbackMessage: string): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        return 'Morate biti prijavljeni da biste videli clanove boarda.';
      }

      if (error.status === 403) {
        return 'Nemate dozvolu za ovu akciju na boardu.';
      }

      if (error.status === 404) {
        return 'Board ili invite nisu pronadjeni.';
      }

      return fallbackMessage;
    }

    return fallbackMessage;
  }
}
