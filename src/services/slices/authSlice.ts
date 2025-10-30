import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';

type AuthState = {
  isAuthenticated: boolean;
  user: TUser | null;
};

const initialState: AuthState = {
  isAuthenticated: Boolean(localStorage.getItem('refreshToken')),
  user: JSON.parse(localStorage.getItem('user') || 'null')
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<TUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }
});

export const { setUser, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
