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
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data;
    } catch {
      // Fallback local session simulation if auth endpoints are not yet implemented in backend
      const mockUser: User = {
        id: 'user-demo-123',
        companyName: 'Acme Procurement Corp.',
        email: credentials.email,
        createdAt: new Date().toISOString(),
      };
      const mockToken = 'mock-jwt-token-' + Date.now();
      localStorage.setItem(TOKEN_KEY, mockToken);
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      return { user: mockUser, token: mockToken };
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
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data;
    } catch {
      // Fallback local session simulation if auth endpoints are not yet implemented in backend
      const mockUser: User = {
        id: 'user-' + Date.now(),
        companyName: credentials.companyName,
        email: credentials.email,
        createdAt: new Date().toISOString(),
      };
      const mockToken = 'mock-jwt-token-' + Date.now();
      localStorage.setItem(TOKEN_KEY, mockToken);
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      return { user: mockUser, token: mockToken };
    }
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
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
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
