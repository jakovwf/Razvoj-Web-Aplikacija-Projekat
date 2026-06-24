import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Card } from '../../store/models';

export interface CreateCardData {
  title: string;
  description?: string;
}

export interface UpdateCardData {
  title?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private readonly http = inject(HttpClient);

  createCard(listId: string, data: CreateCardData): Observable<Card> {
    return this.http.post<Card>(`${environment.apiUrl}/lists/${listId}/cards`, data);
  }

  getCard(cardId: string): Observable<Card> {
    return this.http.get<Card>(`${environment.apiUrl}/cards/${cardId}`);
  }

  updateCard(cardId: string, data: UpdateCardData): Observable<Card> {
    return this.http.patch<Card>(`${environment.apiUrl}/cards/${cardId}`, data);
  }

  deleteCard(cardId: string): Observable<Card> {
    return this.http.delete<Card>(`${environment.apiUrl}/cards/${cardId}`);
  }
}
