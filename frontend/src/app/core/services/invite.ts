import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AcceptInviteResponse, BoardInvite } from '../../store/models';

@Injectable({
  providedIn: 'root',
})
export class InviteService {
  private readonly http = inject(HttpClient);
  private readonly invitesApiUrl = `${environment.apiUrl}/invites`;

  getInvite(token: string): Observable<BoardInvite> {
    return this.http.get<BoardInvite>(`${this.invitesApiUrl}/${token}`);
  }

  acceptInvite(token: string): Observable<AcceptInviteResponse> {
    return this.http.post<AcceptInviteResponse>(`${this.invitesApiUrl}/${token}/accept`, {});
  }

  declineInvite(token: string): Observable<BoardInvite> {
    return this.http.post<BoardInvite>(`${this.invitesApiUrl}/${token}/decline`, {});
  }
}
