import React, { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  loginThunk,
  registerThunk,
  logoutThunk,
  checkAuthThunk,
  clearError as clearAuthError,
} from '../store/authSlice';
import {
  type User,
  type LoginCredentials,
  type RegisterCredentials,
} from '../types/auth.types';

export interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      const action = await dispatch(loginThunk(credentials));
      return loginThunk.fulfilled.match(action);
    },
    [dispatch]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials): Promise<boolean> => {
      const action = await dispatch(registerThunk(credentials));
      return registerThunk.fulfilled.match(action);
    },
    [dispatch]
  );

  const logout = useCallback(async (): Promise<void> => {
    await dispatch(logoutThunk());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuthThunk());
  }, [dispatch]);

  return <>{children}</>;
};
