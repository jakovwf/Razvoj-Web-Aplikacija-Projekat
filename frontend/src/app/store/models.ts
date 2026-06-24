export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  createdAt?: string;
}

export interface BoardMember {
  id: string;
  boardId: string;
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  user?: User;
}

export interface Board {
  id: string;
  title: string;
  description?: string | null;
  backgroundUrl?: string | null;
  workspaceId: string;
  createdAt?: string;
  members?: BoardMember[];
  workspace?: unknown;
  lists?: unknown[];
  labels?: unknown[];
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  isRead: boolean;
  relatedBoardId?: string | null;
  relatedCardId?: string | null;
  relatedInviteId?: string | null;
  createdAt?: string;
  relatedCard?: unknown;
  relatedInvite?: unknown;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  user?: User;
}
