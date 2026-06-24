import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import {
  createCard,
  createList,
  deleteCard,
  deleteList,
  loadBoard,
  updateCard,
  updateList,
} from '../../../store/boards/boards.actions';
import {
  selectBoardsError,
  selectBoardsLoading,
  selectSelectedBoard,
} from '../../../store/boards/boards.selectors';
import { Card } from '../../../store/models';

@Component({
  selector: 'app-board',
  imports: [AsyncPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);

  readonly board$ = this.store.select(selectSelectedBoard);
  readonly loading$ = this.store.select(selectBoardsLoading);
  readonly error$ = this.store.select(selectBoardsError);
  readonly selectedCard = signal<Card | null>(null);

  readonly listForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
  });

  readonly cardEditForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
    description: [''],
  });

  constructor() {
    this.route.paramMap
      .pipe(map((params) => params.get('boardId')))
      .subscribe((boardId) => {
        if (boardId) {
          this.store.dispatch(loadBoard({ boardId }));
        }
      });
  }

  createList(boardId: string): void {
    if (this.listForm.invalid) {
      this.listForm.markAllAsTouched();
      return;
    }

    const { title } = this.listForm.getRawValue();
    this.store.dispatch(createList({ boardId, title }));
    this.listForm.reset();
  }

  renameList(listId: string, title: string): void {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    this.store.dispatch(updateList({ listId, title: trimmedTitle }));
  }

  removeList(listId: string): void {
    this.store.dispatch(deleteList({ listId }));
  }

  createCard(listId: string, titleInput: HTMLInputElement, descriptionInput: HTMLInputElement): void {
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title) {
      return;
    }

    this.store.dispatch(createCard({ listId, title, description: description || undefined }));
    titleInput.value = '';
    descriptionInput.value = '';
  }

  openCard(card: Card): void {
    this.selectedCard.set(card);
    this.cardEditForm.setValue({
      title: card.title,
      description: card.description ?? '',
    });
  }

  closeCard(): void {
    this.selectedCard.set(null);
    this.cardEditForm.reset();
  }

  saveSelectedCard(): void {
    const card = this.selectedCard();

    if (!card || this.cardEditForm.invalid) {
      this.cardEditForm.markAllAsTouched();
      return;
    }

    const { title, description } = this.cardEditForm.getRawValue();
    this.store.dispatch(
      updateCard({
        cardId: card.id,
        title,
        description: description.trim() || undefined,
      }),
    );
    this.closeCard();
  }

  removeSelectedCard(): void {
    const card = this.selectedCard();

    if (!card) {
      return;
    }

    this.store.dispatch(deleteCard({ cardId: card.id }));
    this.closeCard();
  }
}
