import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../services/auth.service';
import {
  type User,
  type LoginCredentials,
  type RegisterCredentials,
  type AuthResponse,
} from '../types/auth.types';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  isSubmitting: boolean;
  isLoggingOut: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialUser = authService.getCurrentUser();
const initialToken = authService.getToken();

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialUser,
  isCheckingAuth: false,
  isSubmitting: false,
  isLoggingOut: false,
  isLoading: false,
  error: null,
};

export const checkAuthThunk = createAsyncThunk<User | null, void, { rejectValue: string }>(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getProfile();
      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Session verification failed';
      return rejectWithValue(message);
    }
  }
);

export const loginThunk = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.login(credentials);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid email or password';
    return rejectWithValue(message);
  }
});

export const registerThunk = createAsyncThunk<
  AuthResponse,
  RegisterCredentials,
  { rejectValue: string }
>('auth/register', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.register(credentials);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    return rejectWithValue(message);
  }
});

export const logoutThunk = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      return rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    // checkAuthThunk: initial session hydration
    builder
      .addCase(checkAuthThunk.pending, (state) => {
        state.isCheckingAuth = false;
        state.isLoading = false;
      })
      .addCase(checkAuthThunk.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(checkAuthThunk.rejected, (state) => {
        state.isCheckingAuth = false;
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });

    // loginThunk: user form submission
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.user = action.payload.user;
        state.token = action.payload.token ?? null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = typeof action.payload === 'string' ? action.payload : action.error.message || 'Login failed';
      });

    // registerThunk: user registration submission
    builder
      .addCase(registerThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.user = action.payload.user;
        state.token = action.payload.token ?? null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = typeof action.payload === 'string' ? action.payload : action.error.message || 'Registration failed';
      });

    // logoutThunk
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.isLoggingOut = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isLoggingOut = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state) => {
        state.isLoggingOut = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
