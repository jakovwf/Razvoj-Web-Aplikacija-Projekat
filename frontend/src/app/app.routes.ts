import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { GuestGuard } from './core/guards/guest-guard';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { BoardActivity } from './features/board/board-activity/board-activity';
import { BoardMembers } from './features/board/board-members/board-members';
import { Board } from './features/board/board/board';
import { Home } from './features/home/home';
import { Invite } from './features/invite/invite';
import { Landing } from './features/landing/landing';
import { NotFound } from './features/not-found/not-found';
import { Notifications } from './features/notifications/notifications';
import { Profile } from './features/profile/profile';
import { Workspace } from './features/workspace/workspace';

export const routes: Routes = [
  { path: '', component: Landing, canActivate: [GuestGuard] },
  { path: 'login', component: Login, canActivate: [GuestGuard] },
  { path: 'register', component: Register, canActivate: [GuestGuard] },
  { path: 'invite/:token', component: Invite },
  { path: 'invites/:token', component: Invite },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: Home },
      { path: 'w/:workspaceId', component: Workspace },
      { path: 'b/:boardId', component: Board },
      { path: 'b/:boardId/members', component: BoardMembers },
      { path: 'b/:boardId/activity', component: BoardActivity },
      { path: 'notifications', component: Notifications },
      { path: 'profile', component: Profile },
    ],
  },
  { path: '**', component: NotFound },
];
