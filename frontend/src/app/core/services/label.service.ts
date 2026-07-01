import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CardLabel, Label } from '../../store/models';

@Injectable({ providedIn: 'root' })
export class LabelService {
  private readonly http = inject(HttpClient);

  getBoardLabels(boardId: string): Observable<Label[]> {
    return this.http.get<Label[]>(`${environment.apiUrl}/boards/${boardId}/labels`);
  }

  createLabel(boardId: string, name: string, color: string): Observable<Label> {
    return this.http.post<Label>(`${environment.apiUrl}/boards/${boardId}/labels`, {
      name,
      color,
    });
  }

  updateLabel(id: string, name: string, color: string): Observable<Label> {
    return this.http.patch<Label>(`${environment.apiUrl}/labels/${id}`, { name, color });
  }

  deleteLabel(id: string): Observable<Label> {
    return this.http.delete<Label>(`${environment.apiUrl}/labels/${id}`);
  }

  addLabelToCard(cardId: string, labelId: string): Observable<CardLabel> {
    return this.http.post<CardLabel>(`${environment.apiUrl}/cards/${cardId}/labels`, { labelId });
  }

  removeLabelFromCard(cardId: string, labelId: string): Observable<CardLabel> {
    return this.http.delete<CardLabel>(`${environment.apiUrl}/cards/${cardId}/labels/${labelId}`);
  }
}
