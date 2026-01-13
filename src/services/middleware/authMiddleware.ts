import { Middleware } from '@reduxjs/toolkit';
import { setUser, logout } from '../slices/authSlice';
import { RootState } from '../store';

export const authMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    const result = next(action);

    if (setUser.match(action)) {
      localStorage.setItem('user', JSON.stringify(action.payload));
      localStorage.setItem('refreshToken', 'true'); // или сохраняйте реальный токен
    }

    if (logout.match(action)) {
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
    }

    return result;
  };
