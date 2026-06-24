import { createReducer, on } from '@ngrx/store';
import { User } from '../models';
import {
  loadMe,
  loadMeFailure,
  loadMeSuccess,
  login,
  loginFailure,
  loginSuccess,
  logout,
  register,
} from './auth.actions';

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  token: localStorage.getItem('auth_token'),
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialAuthState,
  on(login, register, loadMe, (state) => ({ ...state, loading: true, error: null })),
  on(loginSuccess, (state, { user, token }) => ({ ...state, user, token, loading: false })),
  on(loginFailure, loadMeFailure, (state, { error }) => ({
    ...state,
    user: null,
    token: null,
    loading: false,
    error,
  })),
  on(loadMeSuccess, (state, { user }) => ({ ...state, user, loading: false, error: null })),
  on(logout, () => ({ ...initialAuthState, user: null, token: null, error: null })),
);
