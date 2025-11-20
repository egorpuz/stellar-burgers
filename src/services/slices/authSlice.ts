import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';

type AuthState = {
  isAuthenticated: boolean;
  user: TUser | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
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
    },
    initializeAuth(
      state,
      action: PayloadAction<{ user: TUser | null; isAuthenticated: boolean }>
    ) {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
    }
  }
});

export const { setUser, logout, initializeAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
