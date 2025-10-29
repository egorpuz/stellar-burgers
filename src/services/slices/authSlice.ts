import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';

type AuthState = {
  isAuthenticated: boolean;
  user: TUser | null;
};

const initialState: AuthState = {
  isAuthenticated: Boolean(localStorage.getItem('refreshToken')),
  user: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<TUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('refreshToken');
    }
  }
});

export const { setUser, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
