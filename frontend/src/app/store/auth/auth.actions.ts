import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../models';

export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ email: string; password: string }>(),
    'Login Success': props<{ user: User; token: string }>(),
    'Login Failure': props<{ error: string }>(),
    Register: props<{ displayName: string; email: string; password: string }>(),
    Logout: emptyProps(),
    'Load Me': emptyProps(),
    'Load Me Success': props<{ user: User }>(),
    'Load Me Failure': props<{ error: string }>(),
  },
});

export const {
  login,
  loginSuccess,
  loginFailure,
  register,
  logout,
  loadMe,
  loadMeSuccess,
  loadMeFailure,
} = authActions;
