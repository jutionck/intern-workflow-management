import { httpClient } from '@/lib/http-client';
import { API_ENDPOINTS } from '@/constants';
import type {
  User,
  LoginCredentials,
  AuthResponse,
  ApiResponse
} from '@/types';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
      { requiresAuth: false }
    );

    if (response.data) {
      return response.data;
    }

    throw new Error('Invalid response format');
  }

  static async register(userData: {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'student';
    department?: string;
  }): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData,
      { requiresAuth: false }
    );

    if (response.data) {
      return response.data;
    }

    throw new Error('Invalid response format');
  }

  static async logout(): Promise<void> {
    await httpClient.post(
      API_ENDPOINTS.AUTH.LOGOUT,
      {},
      { requiresAuth: true }
    );
  }

  static async refreshToken(): Promise<{ token: string }> {
    const response = await httpClient.post<{ token: string }>(
      API_ENDPOINTS.AUTH.REFRESH,
      {},
      { requiresAuth: true }
    );

    if (response.data) {
      return response.data;
    }

    throw new Error('Invalid response format');
  }

  static async getCurrentUser(): Promise<User> {
    const response = await httpClient.get<User>('/auth/me');

    if (response.data) {
      return response.data;
    }

    throw new Error('Invalid response format');
  }
}