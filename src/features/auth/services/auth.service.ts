import apiClient from '../../../lib/axios';
import { type ApiResponse } from '../../../types/api';
import {
  type User,
  type LoginCredentials,
  type RegisterCredentials,
  type AuthResponse,
} from '../types/auth.types';

const TOKEN_KEY = 'quotewise_auth_token';
const USER_KEY = 'quotewise_user';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      const data = response.data.data;
      if (data && data.user) {
        if (data.token) {
          localStorage.setItem(TOKEN_KEY, data.token);
        }
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data;
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Authentication failed');
    }
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', {
        companyName: credentials.companyName,
        email: credentials.email,
        password: credentials.password,
      });
      const data = response.data.data;
      if (data && data.user) {
        if (data.token) {
          localStorage.setItem(TOKEN_KEY, data.token);
        }
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data;
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Registration failed');
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Continue client cleanup even if network fails
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  async getProfile(): Promise<User | null> {
    try {
      const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
      const user = response.data.data?.user;
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        return user;
      }
      return null;
    } catch {
      return this.getCurrentUser();
    }
  },

  getCurrentUser(): User | null {
    const rawUser = localStorage.getItem(USER_KEY);
    if (!rawUser) return null;
    try {
      return JSON.parse(rawUser) as User;
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(USER_KEY);
  },
};
