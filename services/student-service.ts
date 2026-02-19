import { apiClient } from './api';
import { UserListItem, CreateUserDto, UpdateUserDto } from '@/types/user';
import { ApiResponse, PaginatedResponse } from '@/types/api';

export const studentService = {
  async getStudents(page = 1, limit = 10, search = ''): Promise<PaginatedResponse<UserListItem>> {
    const params = `page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
    return apiClient.get(`/api/students?${params}`);
  },

  async getStudent(id: string): Promise<ApiResponse<UserListItem>> {
    return apiClient.get(`/api/students/${id}`);
  },

  async createStudent(data: CreateUserDto): Promise<ApiResponse<UserListItem>> {
    return apiClient.post('/api/students', data);
  },

  async updateStudent(id: string, data: UpdateUserDto): Promise<ApiResponse<UserListItem>> {
    return apiClient.put(`/api/students/${id}`, data);
  },

  async deleteStudent(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`/api/students/${id}`);
  },
};
