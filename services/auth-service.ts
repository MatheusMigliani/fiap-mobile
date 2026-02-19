import { apiClient } from './api';
import { LoginResponse } from '@/types/auth';

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/api/auth/login', { email, password });
  },
};
