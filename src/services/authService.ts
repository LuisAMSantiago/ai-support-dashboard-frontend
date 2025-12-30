import apiClient, { getCsrfCookie } from './apiClient';
import type { User, LoginCredentials, SingleResponse } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    await getCsrfCookie();
    const response = await apiClient.post<SingleResponse<User>>('/api/auth/login', credentials);
    return response.data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout');
  },

  async getMe(): Promise<User> {
    // Adicionar headers para evitar cache de resposta autenticada
    const response = await apiClient.get<SingleResponse<User>>('/api/auth/me', {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
    return response.data.data;
  },
};

export default authService;
