import { apiClient } from './api';
import { UserListItem, CreateUserDto, UpdateUserDto } from '@/types/user';
import { ApiResponse, PaginatedResponse } from '@/types/api';

export const professorService = {
  async getProfessors(page = 1, limit = 10, search = ''): Promise<PaginatedResponse<UserListItem>> {
    const params = `page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
    return apiClient.get(`/api/professors?${params}`);
  },

  async getProfessor(id: string): Promise<ApiResponse<UserListItem>> {
    return apiClient.get(`/api/professors/${id}`);
  },

  async createProfessor(data: CreateUserDto): Promise<ApiResponse<UserListItem>> {
    return apiClient.post('/api/professors', data);
  },

  async updateProfessor(id: string, data: UpdateUserDto): Promise<ApiResponse<UserListItem>> {
    return apiClient.put(`/api/professors/${id}`, data);
  },

  async deleteProfessor(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`/api/professors/${id}`);
  },
};
