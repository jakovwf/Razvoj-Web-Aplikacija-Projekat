import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private readonly authService = inject(AuthService);
  private socket?: Socket;
  private activeBoardId?: string;

  connect(token: string): void {
    const authToken = token || this.authService.getToken();

    if (!authToken) {
      return;
    }

    this.disconnect();
    this.socket = io(environment.apiUrl, {
      auth: { token: authToken },
      transports: ['websocket'],
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = undefined;
    this.activeBoardId = undefined;
  }

  joinBoard(boardId: string): void {
    if (this.activeBoardId && this.activeBoardId !== boardId) {
      this.socket?.emit('board:leave', { boardId: this.activeBoardId });
    }

    this.activeBoardId = boardId;
    this.socket?.emit('board:join', { boardId });
  }

  leaveBoard(boardId: string): void {
    this.socket?.emit('board:leave', { boardId });

    if (this.activeBoardId === boardId) {
      this.activeBoardId = undefined;
    }
  }

  leaveCurrentBoard(): void {
    if (this.activeBoardId) {
      this.leaveBoard(this.activeBoardId);
    }
  }

  on<T>(event: string): Observable<T> {
    return new Observable<T>((observer) => {
      const listener = (data: T) => observer.next(data);
      this.socket?.on(event, listener);

      return () => this.socket?.off(event, listener);
    });
  }

  get socketId(): string | undefined {
    return this.socket?.id;
  }
}
