import { Component, inject } from '@angular/core';
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
  error: string | null = null;

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
        }
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

    this.boardService
      .createBoardInvite(this.boardId, { inviteeEmail })
      .pipe(take(1))
      .subscribe({
        next: (invite) => {
          this.invites = [invite, ...this.invites];
          this.inviteForm.reset();
          this.inviteSaving = false;
        },
        error: () => {
          this.error = 'Invite nije poslat.';
          this.inviteSaving = false;
        },
      });
  }

  revokeInvite(inviteId: string): void {
    if (!this.boardId || !confirm('Da li zelite da povucete ovaj invite?')) {
      return;
    }

    this.error = null;

    this.boardService
      .deleteBoardInvite(this.boardId, inviteId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.invites = this.invites.filter((invite) => invite.id !== inviteId);
        },
        error: () => {
          this.error = 'Invite nije povucen.';
        },
      });
  }

  private loadBoardMembers(boardId: string): void {
    this.loading = true;
    this.error = null;

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
        error: () => {
          this.error = 'Clanovi boarda nisu ucitani.';
          this.loading = false;
        },
      });
  }
}
