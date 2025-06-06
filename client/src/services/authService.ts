import api from '../utils/api';
import { User, ApiResponse } from '../types';

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
      email,
      password
    });
    return response.data;
  },

  async register(email: string, password: string, name: string): Promise<ApiResponse<RegisterResponse>> {
    const response = await api.post<ApiResponse<RegisterResponse>>('/auth/register', {
      email,
      password,
      name
    });
    return response.data;
  },

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await api.post<ApiResponse<{ token: string }>>('/auth/refresh');
    return response.data;
  },

  async refreshUser(): Promise<ApiResponse<{ user: User }>> {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data;
  }
}; 